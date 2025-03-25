from app import create_app

app = create_app()

# Add Vercel serverless compatibility
@app.route('/', methods=['GET'])
def home():
    """Root endpoint for Vercel."""
    return {'message': 'Data Privacy API is running on Vercel'}, 200

if __name__ == "__main__":
    app.run(debug=True) 