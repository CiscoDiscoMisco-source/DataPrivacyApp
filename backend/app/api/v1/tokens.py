from flask import Blueprint, jsonify, request
from app.models.user import TokenPackage
from app.repositories.user import TokenPackageRepository
from app.utils.error_handlers import APIError
from app.utils.auth import admin_required

tokens_bp = Blueprint('tokens', __name__)

@tokens_bp.route('/packages', methods=['GET'])
async def get_token_packages():
    """Get all available token packages."""
    try:
        packages = await TokenPackage.get_all()
        return jsonify([package.to_dict() for package in packages])
    except Exception as e:
        raise APIError(f"Failed to get token packages: {str(e)}")

@tokens_bp.route('/packages/<int:package_id>', methods=['GET'])
async def get_token_package(package_id):
    """Get a specific token package by ID."""
    try:
        package = await TokenPackage.find_by_id(package_id)
        if not package:
            raise APIError("Token package not found", status_code=404)
        return jsonify(package.to_dict())
    except Exception as e:
        raise APIError(f"Failed to get token package: {str(e)}")

@tokens_bp.route('/packages', methods=['POST'])
@admin_required
async def create_token_package():
    """Create a new token package (admin only)."""
    try:
        data = request.get_json()
        package = TokenPackage(
            name=data['name'],
            amount=data['amount'],
            price=data['price'],
            description=data.get('description', '')
        )
        saved_package = await package.save()
        return jsonify(saved_package.to_dict()), 201
    except Exception as e:
        raise APIError(f"Failed to create token package: {str(e)}")

@tokens_bp.route('/packages/<int:package_id>', methods=['PUT'])
@admin_required
async def update_token_package(package_id):
    """Update a token package (admin only)."""
    try:
        package = await TokenPackage.find_by_id(package_id)
        if not package:
            raise APIError("Token package not found", status_code=404)
        
        data = request.get_json()
        package.name = data.get('name', package.name)
        package.amount = data.get('amount', package.amount)
        package.price = data.get('price', package.price)
        package.description = data.get('description', package.description)
        
        updated_package = await package.save()
        return jsonify(updated_package.to_dict())
    except Exception as e:
        raise APIError(f"Failed to update token package: {str(e)}")

@tokens_bp.route('/packages/<int:package_id>', methods=['DELETE'])
@admin_required
async def delete_token_package(package_id):
    """Delete a token package (admin only)."""
    try:
        package = await TokenPackage.find_by_id(package_id)
        if not package:
            raise APIError("Token package not found", status_code=404)
        
        success = await package.delete()
        if not success:
            raise APIError("Failed to delete token package")
        return '', 204
    except Exception as e:
        raise APIError(f"Failed to delete token package: {str(e)}") 