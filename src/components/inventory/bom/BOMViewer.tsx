import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronDown, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BOMNode {
  id: string;
  parent_product_id: string;
  child_product_id: string;
  quantity_per: number;
  bom_level: number;
  parent_name?: string;
  child_name?: string;
  child_sku?: string;
}

interface TreeNode extends BOMNode {
  children?: TreeNode[];
  isExpanded?: boolean;
}

export function BOMViewer() {
  const [bomData, setBomData] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBOMData();
  }, []);

  const loadBOMData = async () => {
    try {
      console.log('[BOMViewer] Starting BOM data load...');
      
      const { data: bomRaw, error: bomError } = await supabase
        .from('product_bom')
        .select(`
          id,
          parent_product_id,
          child_product_id,
          quantity_per,
          bom_level
        `)
        .order('bom_level', { ascending: true });

      console.log('[BOMViewer] BOM query result:', { count: bomRaw?.length, error: bomError });

      if (bomError) throw bomError;

      if (!bomRaw || bomRaw.length === 0) {
        console.log('[BOMViewer] No BOM data found in database');
        setIsLoading(false);
        return;
      }

      // Load product details
      const productIds = new Set([
        ...bomRaw.map((b: BOMNode) => b.parent_product_id),
        ...bomRaw.map((b: BOMNode) => b.child_product_id),
      ]);

      const { data: products, error: prodError } = await supabase
        .from('product_master')
        .select('product_id, name, sku')
        .in('product_id', Array.from(productIds));

      if (prodError) throw prodError;

      const productMap = new Map(products.map((p: any) => [p.product_id, p]));

      // Enrich BOM with product names
      const enrichedBOM = bomRaw.map((b: BOMNode) => ({
        ...b,
        parent_name: productMap.get(b.parent_product_id)?.name,
        child_name: productMap.get(b.child_product_id)?.name,
        child_sku: productMap.get(b.child_product_id)?.sku,
      }));

      // Build tree structure
      const tree = buildBOMTree(enrichedBOM);
      setBomData(tree);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading BOM:', error);
      toast.error('Failed to load Bill of Materials');
      setIsLoading(false);
    }
  };

  const buildBOMTree = (flatBOM: TreeNode[]): TreeNode[] => {
    console.log('[BOMViewer] Building tree from', flatBOM.length, 'items');
    
    // Find all unique parent products (roots)
    const allParents = new Set(flatBOM.map(b => b.parent_product_id));
    const allChildren = new Set(flatBOM.map(b => b.child_product_id));
    const rootProducts = Array.from(allParents).filter(p => !allChildren.has(p));
    
    console.log('[BOMViewer] Root products:', rootProducts);

    // Group by parent
    const grouped = new Map<string, TreeNode[]>();
    flatBOM.forEach((node) => {
      if (!grouped.has(node.parent_product_id)) {
        grouped.set(node.parent_product_id, []);
      }
      grouped.get(node.parent_product_id)!.push({ ...node, children: [] });
    });

    // Build tree for each root
    const roots: TreeNode[] = [];
    rootProducts.forEach((rootId) => {
      const rootChildren = grouped.get(rootId) || [];
      if (rootChildren.length > 0) {
        // Create a virtual root node for the finished product
        const rootNode: TreeNode = {
          id: rootId,
          parent_product_id: '',
          child_product_id: rootId,
          quantity_per: 1,
          bom_level: 0,
          parent_name: rootChildren[0]?.parent_name || rootId,
          child_name: rootChildren[0]?.parent_name || rootId,
          children: rootChildren
        };
        roots.push(rootNode);
      }
    });

    console.log('[BOMViewer] Built tree with', roots.length, 'root nodes');
    return roots;
  };

  const toggleNode = (productId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const renderBOMNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.child_product_id);

    return (
      <div key={node.id} style={{ marginLeft: `${level * 24}px` }} className="my-2">
        <div
          className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer"
          onClick={() => hasChildren && toggleNode(node.child_product_id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}
          <Package className="h-4 w-4 text-primary" />
          <span className="font-medium">{node.child_name || node.child_product_id}</span>
          {node.child_sku && (
            <Badge variant="outline" className="text-xs">
              {node.child_sku}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            Qty: {node.quantity_per}
          </span>
          <Badge variant="secondary" className="text-xs">
            L{node.bom_level}
          </Badge>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children!.map((child) => renderBOMNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill of Materials (BOM) Structure</CardTitle>
      </CardHeader>
      <CardContent>
        {bomData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No BOM data available</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {bomData.map((node) => renderBOMNode(node))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
