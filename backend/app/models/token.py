from datetime import datetime
from typing import Optional, List, Dict, Any

class RevokedToken:
    """Model for storing revoked JWT tokens"""
    TABLE_NAME = 'revoked_tokens'

    def __init__(self, jti: str, expires_at: datetime, user_id: int):
        self.jti = jti
        self.expires_at = expires_at
        self.user_id = user_id
        self.revoked_at = datetime.utcnow()

    @classmethod
    def is_blacklisted(cls, supabase, jti: str) -> bool:
        """Check if a token is blacklisted"""
        result = supabase.table(cls.TABLE_NAME).select('id').eq('jti', jti).execute()
        return len(result.data) > 0

    @classmethod
    def add(cls, supabase, jti: str, expires_at: datetime, user_id: int) -> Dict[str, Any]:
        """Add a token to the blacklist"""
        token_data = {
            'jti': jti,
            'expires_at': expires_at.isoformat(),
            'user_id': user_id,
            'revoked_at': datetime.utcnow().isoformat()
        }
        result = supabase.table(cls.TABLE_NAME).insert(token_data).execute()
        return result.data[0]

    @classmethod
    def cleanup_expired(cls, supabase) -> None:
        """Remove expired tokens from the blacklist"""
        current_time = datetime.utcnow().isoformat()
        supabase.table(cls.TABLE_NAME).delete().lt('expires_at', current_time).execute()

    @classmethod
    def get_user_tokens(cls, supabase, user_id: int) -> List[Dict[str, Any]]:
        """Get all active tokens for a user"""
        result = supabase.table(cls.TABLE_NAME).select('*').eq('user_id', user_id).execute()
        return result.data

    @classmethod
    def delete_token(cls, supabase, token_id: int) -> None:
        """Delete a specific token"""
        supabase.table(cls.TABLE_NAME).delete().eq('id', token_id).execute() 