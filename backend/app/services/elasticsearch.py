from elasticsearch import Elasticsearch
from flask import current_app
import json

class ElasticsearchService:
    """Service for interacting with Elasticsearch."""
    
    def __init__(self):
        """Initialize Elasticsearch client."""
        self.es = Elasticsearch(
            [current_app.config.get('ELASTICSEARCH_URL')],
            basic_auth=(
                current_app.config.get('ELASTICSEARCH_USERNAME'),
                current_app.config.get('ELASTICSEARCH_PASSWORD')
            )
        )
        self.index_prefix = current_app.config.get('ELASTICSEARCH_INDEX_PREFIX', 'data_privacy_')
    
    def get_index_name(self, index_type):
        """Get the full index name for a given type."""
        env = current_app.config.get('FLASK_ENV', 'development')
        return f"{self.index_prefix}{index_type}_{env}"
    
    def index_document(self, index_type, document_id, document):
        """
        Index a document in Elasticsearch.
        
        Args:
            index_type: The type of index (e.g., 'company', 'user', 'data_type')
            document_id: The ID of the document
            document: The document to index
            
        Returns:
            The response from Elasticsearch
        """
        index_name = self.get_index_name(index_type)
        
        # Ensure index exists
        if not self.es.indices.exists(index=index_name):
            self.create_index(index_type)
        
        return self.es.index(
            index=index_name,
            id=document_id,
            document=document
        )
    
    def create_index(self, index_type):
        """
        Create an index with mappings based on the type.
        
        Args:
            index_type: The type of index to create
            
        Returns:
            The response from Elasticsearch
        """
        index_name = self.get_index_name(index_type)
        
        # Define mappings based on index type
        mappings = {}
        
        if index_type == 'company':
            mappings = {
                "properties": {
                    "name": {"type": "text", "analyzer": "english"},
                    "description": {"type": "text", "analyzer": "english"},
                    "industry": {"type": "keyword"},
                    "website": {"type": "keyword"},
                    "city": {"type": "keyword"},
                    "state": {"type": "keyword"},
                    "country": {"type": "keyword"}
                }
            }
        elif index_type == 'data_type':
            mappings = {
                "properties": {
                    "name": {"type": "text", "analyzer": "english"},
                    "description": {"type": "text", "analyzer": "english"},
                    "category": {"type": "keyword"},
                    "sensitivity_level": {"type": "keyword"}
                }
            }
        
        # Create index with mappings
        return self.es.indices.create(
            index=index_name,
            mappings=mappings
        )
    
    def search(self, index_type, query_string, filters=None, size=20):
        """
        Search for documents in an index.
        
        Args:
            index_type: The type of index to search
            query_string: The search query
            filters: Optional dictionary of filters
            size: Maximum number of results to return
            
        Returns:
            The search results
        """
        index_name = self.get_index_name(index_type)
        
        # Build query
        query = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": query_string,
                                "fields": ["*"],
                                "type": "best_fields",
                                "fuzziness": "AUTO"
                            }
                        }
                    ]
                }
            },
            "size": size
        }
        
        # Add filters if provided
        if filters:
            filter_clauses = []
            for field, value in filters.items():
                filter_clauses.append({"term": {field: value}})
            
            if filter_clauses:
                query["query"]["bool"]["filter"] = filter_clauses
        
        # Execute search
        try:
            results = self.es.search(index=index_name, body=query)
            return results
        except Exception as e:
            current_app.logger.error(f"Elasticsearch search error: {e}")
            return {"error": str(e)}
    
    def delete_document(self, index_type, document_id):
        """
        Delete a document from an index.
        
        Args:
            index_type: The type of index
            document_id: The ID of the document to delete
            
        Returns:
            The response from Elasticsearch
        """
        index_name = self.get_index_name(index_type)
        
        try:
            return self.es.delete(index=index_name, id=document_id)
        except Exception as e:
            current_app.logger.error(f"Elasticsearch delete error: {e}")
            return {"error": str(e)} 