"""manual_fix_company_relationships_types

Revision ID: 4663849f7a69
Revises: 
Create Date: 2025-03-25 11:27:48.712836

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4663849f7a69'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Check if the database is PostgreSQL
    # This code will only run for PostgreSQL, not for SQLite
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        # Drop existing foreign key constraints
        op.drop_constraint('company_relationships_source_company_id_fkey', 'company_relationships', type_='foreignkey')
        op.drop_constraint('company_relationships_target_company_id_fkey', 'company_relationships', type_='foreignkey')
        
        # Temporarily disable the trigger
        op.execute('ALTER TABLE companies DISABLE TRIGGER ALL;')
        
        # Change the type of id column in companies table from bigint to varchar if needed
        op.execute('ALTER TABLE companies ALTER COLUMN id TYPE VARCHAR(36) USING id::VARCHAR(36);')
        
        # Re-enable the trigger
        op.execute('ALTER TABLE companies ENABLE TRIGGER ALL;')
        
        # Re-create foreign key constraints
        op.create_foreign_key('company_relationships_source_company_id_fkey', 'company_relationships', 'companies', 
                            ['source_company_id'], ['id'])
        op.create_foreign_key('company_relationships_target_company_id_fkey', 'company_relationships', 'companies', 
                            ['target_company_id'], ['id'])


def downgrade():
    # Check if the database is PostgreSQL
    conn = op.get_bind()
    dialect = conn.dialect.name
    
    if dialect == 'postgresql':
        # Drop constraints
        op.drop_constraint('company_relationships_source_company_id_fkey', 'company_relationships', type_='foreignkey')
        op.drop_constraint('company_relationships_target_company_id_fkey', 'company_relationships', type_='foreignkey')
        
        # Change the type back to bigint (this may cause data loss if ids can't be converted to integers)
        op.execute('ALTER TABLE companies ALTER COLUMN id TYPE BIGINT USING id::BIGINT;')
        
        # Recreate constraints
        op.create_foreign_key('company_relationships_source_company_id_fkey', 'company_relationships', 'companies', 
                            ['source_company_id'], ['id'])
        op.create_foreign_key('company_relationships_target_company_id_fkey', 'company_relationships', 'companies', 
                            ['target_company_id'], ['id'])
