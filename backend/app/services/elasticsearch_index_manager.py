import logging

logger = logging.getLogger(__name__)

def get_index_name(prefix, index_type):
    """Get the full index name for a given type"""
    return f"{prefix}_{index_type}"

def create_company_index(client, index_name):
    """Create the companies index with appropriate mappings"""
    client.indices.create(
        index=index_name,
        body={
            "mappings": {
                "properties": {
                    "company_id": {"type": "integer"},
                    "name": {"type": "text", "analyzer": "standard"},
                    "domain": {"type": "keyword"}
                }
            }
        }
    )
    return True

def get_index_mapping(index_type):
    """Get the mapping definition for a specific index type"""
    mappings = {
        "companies": {
            "properties": {
                "company_id": {"type": "integer"},
                "name": {"type": "text", "analyzer": "standard"},
                "domain": {"type": "keyword"}
            }
        }
    }
    
    return mappings.get(index_type, {}) 