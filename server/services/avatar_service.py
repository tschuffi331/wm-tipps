"""DiceBear avatar URL builder — equivalent of avatarService.ts."""
from urllib.parse import quote

_BG_COLORS = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,f4b8e4,a6d189"


def get_dicebear_url(username: str) -> str:
    """Return a deterministic DiceBear initials avatar URL for *username*."""
    return (
        f"https://api.dicebear.com/9.x/initials/svg"
        f"?seed={quote(username)}&backgroundColor={_BG_COLORS}"
    )
