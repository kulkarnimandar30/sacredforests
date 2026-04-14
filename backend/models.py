from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    role: str
    approval_status: str
    created_at: datetime

    class Config:
        populate_by_name = True

# Sacred Grove Models
class Coordinates(BaseModel):
    lat: float
    lng: float

class SacredGroveCreate(BaseModel):
    name: str
    district: str
    coordinates: Coordinates
    natural_history: str
    present_status: str
    threats: str
    references: Optional[str] = ""
    image: Optional[str] = ""

class SacredGroveResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    district: str
    coordinates: Coordinates
    natural_history: str
    present_status: str
    threats: str
    references: Optional[str] = ""
    image: Optional[str] = ""
    created_at: datetime

    class Config:
        populate_by_name = True

# Article Models
class ArticleCreate(BaseModel):
    title: str
    author: str
    category: str
    excerpt: str
    content: str
    image: Optional[str] = ""
    read_time: str

class ArticleResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    author: str
    category: str
    excerpt: str
    content: str
    image: Optional[str] = ""
    read_time: str
    date: datetime
    
    class Config:
        populate_by_name = True

# News Models
class NewsCreate(BaseModel):
    title: str
    source: str
    summary: str
    link: str
    image: Optional[str] = ""

class NewsResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    source: str
    summary: str
    link: str
    image: Optional[str] = ""
    date: datetime

    class Config:
        populate_by_name = True

# Resource Models
class ResourceCreate(BaseModel):
    title: str
    type: str
    description: str
    download_link: str
    icon: str

class ResourceResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    type: str
    description: str
    download_link: str
    icon: str

    class Config:
        populate_by_name = True

# Threat Report Models
class ThreatReportCreate(BaseModel):
    grove_id: str
    grove_name: str
    district: str
    threat_type: str
    description: str
    severity: str  # Low, Medium, High, Critical
    reported_by: str  # user email
    contact_email: Optional[str] = ""
    contact_phone: Optional[str] = ""

class ThreatReportResponse(BaseModel):
    id: str = Field(alias="_id")
    grove_id: str
    grove_name: str
    district: str
    threat_type: str
    description: str
    severity: str
    reported_by: str
    contact_email: Optional[str] = ""
    contact_phone: Optional[str] = ""
    status: str  # Pending, Under Review, Resolved
    reported_at: datetime

    class Config:
        populate_by_name = True
