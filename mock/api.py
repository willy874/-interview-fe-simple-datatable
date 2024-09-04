from enum import Enum
from random import choice, randint

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

app = FastAPI(title="Symhpox Treelife Interview Mock Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all head
)


class LoginPayload(BaseModel):
    username: str = Field(..., max_length=32, examples=["username"])
    password: str = Field(..., max_length=64, examples=["password"])


class LoginSuccessResponse(BaseModel):
    token: str


class StrEnum(str, Enum):
    pass


class SortByEnum(StrEnum):
    NAME = "name"
    PRICE = "price"
    STOCK = "stock"


class OrderByEnum(StrEnum):
    ASC = "asc"
    DESC = "desc"


class Product(BaseModel):
    name: str = Field(..., description="商品名稱")
    stock: int = Field(..., ge=0, description="商品庫存")
    price: int = Field(..., ge=0, description="商品價格")


class ListProductResponse(BaseModel):
    products: list[Product]
    total: int = Field(..., ge=0)


FAKE_AUTH_TOKEN = "578fb5e6190f1ae639defccf658a6cda85602c8aea154ed3100cb0cb79ed87f1e2523f0430a65969a409a5568f45bedbf4acf97642070ca881660512e2b97e4f"

FAKE_GEM_TYPES = ["紅寶石", "藍寶石", "綠寶石", "黑耀石", "貓眼石", "鑽石", "紫水晶"]
FAKE_GEM_LEVELS = ["破碎", "粗製", "普通", "皇家", "完美"]
FAKE_ITEM_KINDS = ["項鍊", "戒指", "手環", "皇冠", "耳環"]

FAKE_PRODUCTS = [
    Product(
        name=f"{gem_level}{gem_type}{item_kind}",
        price=randint((lv + 1) * 1000, (lv + 2) * 1000),
        stock=randint(0, 255),
    )
    for item_kind in FAKE_ITEM_KINDS
    for lv, gem_level in enumerate(FAKE_GEM_LEVELS)
    for gem_type in FAKE_GEM_TYPES
]

bearer_token_required: callable = HTTPBearer()


def login_required(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_token_required),
) -> HTTPAuthorizationCredentials:
    if credentials.credentials == FAKE_AUTH_TOKEN:
        return credentials

    raise HTTPException(403)


@app.post("/login")
def login(payload: LoginPayload) -> LoginSuccessResponse:
    """
    使用 testuser / ShowMeTheMoney 登入測試 api server
    """
    if payload.username == "testuser" and payload.password == "ShowMeTheMoney":
        return LoginSuccessResponse(token=FAKE_AUTH_TOKEN)

    raise HTTPException(400, detail="login failed")


@app.get("/products", dependencies=[Depends(login_required)])
def list_products(
    q: str | None = Query(
        None, min_length=2, max_length=100, description="搜尋商品名稱"
    ),
    p: int = Query(1, ge=1, description="結果頁數"),
    sort_by: SortByEnum = Query(SortByEnum.NAME, description="排序依據"),
    order_by: OrderByEnum = Query(OrderByEnum.ASC, description="排序方向"),
    page_size: int = Query(20, ge=10, le=50, description="每頁個數"),
) -> ListProductResponse:
    def _get_sort_key(p: Product):
        if sort_by == SortByEnum.NAME:
            return p.name

        elif sort_by == SortByEnum.PRICE:
            return p.price

        elif sort_by == SortByEnum.STOCK:
            return p.stock

    start: int = (p - 1) * page_size

    products = sorted(
        FAKE_PRODUCTS if not q else filter(lambda p: q in p.name, FAKE_PRODUCTS),
        key=_get_sort_key,
        reverse=order_by == OrderByEnum.DESC,
    )

    return ListProductResponse(
        products=products[start : start + page_size], total=len(products)
    )
