
DO $$ BEGIN
  -- Add validation rules for location hierarchy
  INSERT INTO module_settings (module, validation_rules, data_template)
  VALUES (
    'location_hierarchy',
    '{
      "data_types": {
        "location_id": "text",
        "location_desc": "text",
        "parent_id": "text",
        "level": "integer"
      },
      "required_columns": ["location_id", "location_desc", "level"],
      "constraints": {
        "min_rows": 1,
        "allow_duplicates": false
      }
    }',
    '{
      "required_columns": ["location_id", "location_desc", "level"],
      "optional_columns": ["parent_id", "region", "city", "country"],
      "sample_row": {
        "location_id": "LOC001",
        "location_desc": "Main Warehouse",
        "level": 1,
        "parent_id": null,
        "region": "North",
        "city": "Chicago",
        "country": "USA"
      }
    }'
  )
  ON CONFLICT (module) DO UPDATE
  SET 
    validation_rules = EXCLUDED.validation_rules,
    data_template = EXCLUDED.data_template;

  -- Add validation rules for product hierarchy
  INSERT INTO module_settings (module, validation_rules, data_template)
  VALUES (
    'product_hierarchy',
    '{
      "data_types": {
        "sku": "text",
        "name": "text",
        "level": "integer",
        "parent_code": "text"
      },
      "required_columns": ["sku", "name", "level"],
      "constraints": {
        "min_rows": 1,
        "allow_duplicates": false
      }
    }',
    '{
      "required_columns": ["sku", "name", "level"],
      "optional_columns": ["parent_code", "category", "subcategory"],
      "sample_row": {
        "sku": "PRD001",
        "name": "Product Name",
        "level": 1,
        "parent_code": null,
        "category": "Electronics",
        "subcategory": "Phones"
      }
    }'
  )
  ON CONFLICT (module) DO UPDATE
  SET 
    validation_rules = EXCLUDED.validation_rules,
    data_template = EXCLUDED.data_template;
END $$;
