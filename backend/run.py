import os
from app import create_app
from app.services.elasticsearch_service import ElasticsearchService

app = create_app()

# Initialize Elasticsearch indexes if in development mode
if os.getenv('FLASK_ENV') != 'production':
    with app.app_context():
        es_service = ElasticsearchService()
        es_service.create_indexes()

if __name__ == '__main__':
    debug = os.getenv('FLASK_ENV') != 'production'
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    
    app.run(host=host, port=port, debug=debug) 