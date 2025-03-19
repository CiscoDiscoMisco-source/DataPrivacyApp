import os
import logging
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError
from app.services.elasticsearch_index_manager import create_company_index, get_index_name

logger = logging.getLogger(__name__)

class ElasticsearchService:
    """Service for interacting with Elasticsearch"""
    
    def __init__(self):
        # Initialize Elasticsearch client with provided URL and API key from environment variables
        self.es_url = os.getenv('ELASTICSEARCH_URL')
        self.api_key = os.getenv('ELASTICSEARCH_API_KEY')
        
        # Determine which index to use based on environment
        env = os.getenv('FLASK_ENV', 'development')
        self.index_prefix = 'privacy_prod' if env == 'production' else 'privacy_dev'
        
        # Initialize client if credentials are available
        if self.es_url and self.api_key:
            self.client = Elasticsearch(
                self.es_url,
                api_key=self.api_key
            )
            logger.info(f"Elasticsearch client initialized for {self.index_prefix} indexes")
        else:
            self.client = None
            logger.warning("Elasticsearch client not initialized: missing URL or API key")
    
    def get_client(self):
        """Get the Elasticsearch client"""
        return self.client
    
    def create_indexes(self):
        """Create the required indexes if they don't exist"""
        if not self.client:
            logger.warning("Cannot create indexes: Elasticsearch client not initialized")
            return False
        
        companies_index = get_index_name(self.index_prefix, 'companies')
        
        # Check if the companies index exists
        if not self.client.indices.exists(index=companies_index):
            create_company_index(self.client, companies_index)
            logger.info(f"Created {companies_index} index")
        
        return True
    
    def index_company(self, company):
        """Index a company document in Elasticsearch"""
        if not self.client:
            logger.warning("Cannot index company: Elasticsearch client not initialized")
            return False
        
        companies_index = get_index_name(self.index_prefix, 'companies')
        
        # Prepare the document
        doc = company.to_search_dict()
        
        # Index the document
        try:
            self.client.index(
                index=companies_index,
                id=doc["company_id"],
                body=doc
            )
            logger.info(f"Indexed company {doc['name']} (ID: {doc['company_id']})")
            return True
        except Exception as e:
            logger.error(f"Error indexing company {doc['name']}: {str(e)}")
            return False
    
    def delete_company(self, company_id):
        """Delete a company document from Elasticsearch"""
        if not self.client:
            logger.warning("Cannot delete company: Elasticsearch client not initialized")
            return False
        
        companies_index = get_index_name(self.index_prefix, 'companies')
        
        try:
            self.client.delete(
                index=companies_index,
                id=company_id
            )
            logger.info(f"Deleted company with ID {company_id} from index")
            return True
        except NotFoundError:
            logger.warning(f"Company with ID {company_id} not found in index")
            return False
        except Exception as e:
            logger.error(f"Error deleting company {company_id}: {str(e)}")
            return False
    
    def search_companies(self, query, limit=10):
        """Search for companies by name or domain"""
        if not self.client:
            logger.warning("Cannot search companies: Elasticsearch client not initialized")
            return []
        
        companies_index = get_index_name(self.index_prefix, 'companies')
        
        try:
            # Build the search query
            search_query = {
                "size": limit,
                "query": {
                    "multi_match": {
                        "query": query,
                        "fields": ["name^3", "domain"],
                        "type": "best_fields"
                    }
                }
            }
            
            # Execute the search
            response = self.client.search(
                index=companies_index,
                body=search_query
            )
            
            # Extract and return the hits
            results = []
            for hit in response["hits"]["hits"]:
                results.append(hit["_source"])
            
            logger.info(f"Search for '{query}' returned {len(results)} results")
            return results
        except Exception as e:
            logger.error(f"Error searching companies for '{query}': {str(e)}")
            return [] 