# Auth Migration Guide

## Tổng quan
Đã cập nhật toàn bộ luồng authentication từ hệ thống cũ sang hệ thống admin mới theo file Auth Module.

## Thay đổi chính

### 1. AuthService mới (`src/services/api/AuthService.ts`)
- **POST /api/v1/auth/login**: Đăng nhập admin với username/email và password
- **POST /api/v1/auth/logout**: Đăng xuất admin
- **GET /api/v1/auth/me**: Lấy thông tin admin hiện tại
- **POST /api/v1/auth/refresh**: Refresh access token

### 2. useAuth Hook mới (`src/hooks/useAuth.ts`)
- Sử dụng Zustand store với state management tốt hơn
- Hỗ trợ async operations với loading states
- Error handling được cải thiện
- Tự động refresh token khi cần

### 3. AxiosClient cập nhật (`src/utils/axiosClient.ts`)
- Hỗ trợ HTTP-only cookies (`withCredentials: true`)
- Auto-refresh token khi gặp 401 error
- Redirect tự động về `/connect` khi auth fail

### 4. Connect Page đơn giản hóa (`src/app/connect/page.tsx`)
- Chỉ còn form đăng nhập admin
- Loại bỏ các tính năng phức tạp (register, forgot password, etc.)
- Hiển thị thông tin tài khoản mặc định

### 5. Header Component cập nhật (`src/app/components/Header.tsx`)
- Hiển thị thông tin admin thay vì wallet info
- Dropdown menu với thông tin admin profile
- Copy email thay vì wallet address

## Tài khoản mặc định
```
Username: admin
Password: admin123
Email: admin@bittworld.com
Role: admin
```

## Cách sử dụng

### 1. Đăng nhập
```typescript
const { login, isLoading, error } = useAuth();

const handleLogin = async () => {
  try {
    await login('admin', 'admin123');
    // Đăng nhập thành công
  } catch (error) {
    // Xử lý lỗi
  }
};
```

### 2. Kiểm tra authentication
```typescript
const { isAuthenticated, admin } = useAuth();

if (isAuthenticated) {
  console.log('Admin:', admin?.username);
}
```

### 3. Đăng xuất
```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Đã đăng xuất
};
```

### 4. Lấy thông tin admin hiện tại
```typescript
const { getCurrentUser } = useAuth();

useEffect(() => {
  getCurrentUser();
}, []);
```

## Lưu ý quan trọng

1. **Cookies**: Hệ thống sử dụng HTTP-only cookies, không cần lưu token trong localStorage
2. **Auto-refresh**: Token sẽ tự động refresh khi hết hạn
3. **Error handling**: Tất cả API calls đều có error handling
4. **Loading states**: Có loading states cho tất cả operations
5. **Type safety**: Sử dụng TypeScript interfaces cho tất cả API responses

## Migration Checklist

- [x] Tạo AuthService mới
- [x] Cập nhật useAuth hook
- [x] Cập nhật axiosClient
- [x] Đơn giản hóa Connect page
- [x] Cập nhật Header component
- [x] Cập nhật ClientLayout
- [x] Test luồng authentication
- [x] Kiểm tra linter errors

## Testing

1. Truy cập `/connect`
2. Đăng nhập với tài khoản admin mặc định
3. Kiểm tra redirect về trang chủ
4. Kiểm tra thông tin admin trong header
5. Test logout functionality
6. Test auto-refresh token

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra cookies có được set đúng không
- Kiểm tra server có chạy đúng endpoint không
- Kiểm tra CORS settings

### Lỗi Network
- Kiểm tra `NEXT_PUBLIC_API_URL` environment variable
- Kiểm tra server có chạy không

### Token không refresh
- Kiểm tra refresh token có hợp lệ không
- Kiểm tra server có implement refresh endpoint không
