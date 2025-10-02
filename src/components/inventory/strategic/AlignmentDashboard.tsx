import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AlignmentIssue {
  locationId: string;
  region: string;
  productId: string;
  sku: string;
  issueType: 'empty_decouple' | 'orphan_buffer';
  recommendation: string;
}

export function AlignmentDashboard() {
  const [issues, setIssues] = useState<AlignmentIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    aligned: 0,
    emptyDecouples: 0,
    orphanBuffers: 0,
  });

  useEffect(() => {
    loadAlignmentIssues();
  }, []);

  const loadAlignmentIssues = async () => {
    try {
      setIsLoading(true);

      // Get all decoupling points
      const { data: decouplingPoints } = await supabase
        .from('decoupling_points')
        .select('product_id, location_id');

      // Get all products with buffer profiles
      const { data: products } = await supabase
        .from('product_master')
        .select('product_id, sku, buffer_profile_id');

      // Get all locations
      const { data: locations } = await supabase
        .from('location_master')
        .select('location_id, region');

      const alignmentIssues: AlignmentIssue[] = [];

      // Check for empty decouples (decoupling without buffer)
      decouplingPoints?.forEach((dp) => {
        const product = products?.find((p) => p.product_id === dp.product_id);
        const location = locations?.find((l) => l.location_id === dp.location_id);

        if (!product?.buffer_profile_id || product.buffer_profile_id === 'BP_DEFAULT') {
          alignmentIssues.push({
            locationId: dp.location_id,
            region: location?.region || 'N/A',
            productId: dp.product_id,
            sku: product?.sku || 'Unknown',
            issueType: 'empty_decouple',
            recommendation: 'Add buffer profile to complete decoupling setup',
          });
          
          // Log to alignment_violations table
          supabase.from('alignment_violations').upsert({
            location_id: dp.location_id,
            product_id: dp.product_id,
            violation_type: 'empty_decouple',
            status: 'open',
          }, {
            onConflict: 'location_id,product_id,violation_type',
            ignoreDuplicates: false,
          });
        }
      });

      // Check for orphan buffers (buffer without decoupling)
      products?.forEach((product) => {
        if (product.buffer_profile_id && product.buffer_profile_id !== 'BP_DEFAULT') {
          const hasDecoupling = decouplingPoints?.some(
            (dp) => dp.product_id === product.product_id
          );

          if (!hasDecoupling) {
            alignmentIssues.push({
              locationId: 'Multiple',
              region: 'N/A',
              productId: product.product_id,
              sku: product.sku,
              issueType: 'orphan_buffer',
              recommendation: 'Promote location to decoupling point OR remove buffer profile',
            });
            
            // Log to alignment_violations table
            supabase.from('alignment_violations').upsert({
              location_id: 'Multiple',
              product_id: product.product_id,
              violation_type: 'orphan_buffer',
              status: 'open',
            }, {
              onConflict: 'location_id,product_id,violation_type',
              ignoreDuplicates: false,
            });
          }
        }
      });

      setIssues(alignmentIssues);

      // Calculate stats
      const emptyDecouples = alignmentIssues.filter((i) => i.issueType === 'empty_decouple').length;
      const orphanBuffers = alignmentIssues.filter((i) => i.issueType === 'orphan_buffer').length;
      const totalPairs = (decouplingPoints?.length || 0) + (products?.filter(p => p.buffer_profile_id && p.buffer_profile_id !== 'BP_DEFAULT')?.length || 0);
      const aligned = totalPairs - alignmentIssues.length;

      setStats({
        total: totalPairs,
        aligned: Math.max(0, aligned),
        emptyDecouples,
        orphanBuffers,
      });
    } catch (error) {
      console.error('Error loading alignment issues:', error);
      toast.error('Failed to load alignment data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixEmptyDecouple = async (issue: AlignmentIssue) => {
    try {
      // Auto-assign a buffer profile based on product classification
      const { data: classification } = await supabase
        .from('product_classification')
        .select('variability_level')
        .eq('product_id', issue.productId)
        .maybeSingle();

      const bufferProfileId = classification?.variability_level === 'high'
        ? 'BP_HIGH'
        : classification?.variability_level === 'low'
        ? 'BP_LOW'
        : 'BP_MEDIUM';

      const { error } = await supabase
        .from('product_master')
        .update({ buffer_profile_id: bufferProfileId })
        .eq('product_id', issue.productId);

      if (error) throw error;
      
      // Mark violation as resolved
      await supabase
        .from('alignment_violations')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_action: `Auto-assigned buffer profile: ${bufferProfileId}`,
        })
        .eq('product_id', issue.productId)
        .eq('violation_type', 'empty_decouple')
        .eq('status', 'open');

      toast.success(`Buffer profile ${bufferProfileId} assigned to ${issue.sku}`);
      loadAlignmentIssues();
    } catch (error) {
      console.error('Error fixing empty decouple:', error);
      toast.error('Failed to assign buffer profile');
    }
  };

  const handleFixOrphanBuffer = async (issue: AlignmentIssue) => {
    try {
      // Remove buffer profile
      const { error } = await supabase
        .from('product_master')
        .update({ buffer_profile_id: 'BP_DEFAULT' })
        .eq('product_id', issue.productId);

      if (error) throw error;
      
      // Mark violation as resolved
      await supabase
        .from('alignment_violations')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_action: 'Removed orphan buffer profile',
        })
        .eq('product_id', issue.productId)
        .eq('violation_type', 'orphan_buffer')
        .eq('status', 'open');

      toast.success(`Buffer profile removed from ${issue.sku}`);
      loadAlignmentIssues();
    } catch (error) {
      console.error('Error fixing orphan buffer:', error);
      toast.error('Failed to remove buffer profile');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-48 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Decoupling + Buffer configs</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              Aligned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.aligned}</div>
            <p className="text-xs text-muted-foreground mt-1">Properly configured</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1 text-destructive">
              <XCircle className="h-3 w-3" />
              Empty Decouples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.emptyDecouples}</div>
            <p className="text-xs text-muted-foreground mt-1">Missing buffer profiles</p>
          </CardContent>
        </Card>
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-1 text-orange-600">
              <AlertTriangle className="h-3 w-3" />
              Orphan Buffers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.orphanBuffers}</div>
            <p className="text-xs text-muted-foreground mt-1">Buffer without decoupling</p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alignment Issues</CardTitle>
              <CardDescription>
                Review and fix misalignments between decoupling points and buffer profiles
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadAlignmentIssues}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                All configurations are properly aligned! No issues found.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Quick Fix</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">{issue.locationId}</TableCell>
                    <TableCell>{issue.region}</TableCell>
                    <TableCell className="font-mono text-sm">{issue.sku}</TableCell>
                    <TableCell>
                      {issue.issueType === 'empty_decouple' ? (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Empty Decouple
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-500 text-white gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Orphan Buffer
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {issue.recommendation}
                    </TableCell>
                    <TableCell>
                      {issue.issueType === 'empty_decouple' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFixEmptyDecouple(issue)}
                        >
                          Add Buffer
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFixOrphanBuffer(issue)}
                        >
                          Remove Buffer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
