import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = '/api/users';

  private readonly mockUsers: User[] = [
    {
      id: '1',
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan@company.vn',
      phone: '0901234567',
      address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      role: 'Quản trị viên',
      status: 'active',
      createdDate: '2024-01-15',
    },
    {
      id: '2',
      fullName: 'Trần Thị Bích',
      email: 'tranthibich@company.vn',
      phone: '0912345678',
      address: '456 Lê Lợi, Quận 3, TP. Hồ Chí Minh',
      role: 'Nhân viên',
      status: 'active',
      createdDate: '2024-02-20',
    },
    {
      id: '3',
      fullName: 'Lê Minh Cường',
      email: 'leminhcuong@company.vn',
      phone: '0923456789',
      address: '789 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
      role: 'Trưởng phòng',
      status: 'active',
      createdDate: '2024-03-10',
    },
    {
      id: '4',
      fullName: 'Phạm Thị Dung',
      email: 'phamthidung@company.vn',
      phone: '0934567890',
      address: '321 Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
      role: 'Nhân viên',
      status: 'inactive',
      createdDate: '2024-01-28',
    },
    {
      id: '5',
      fullName: 'Hoàng Văn Em',
      email: 'hoangvanem@company.vn',
      phone: '0945678901',
      address: '654 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
      role: 'Kế toán',
      status: 'active',
      createdDate: '2024-04-05',
    },
    {
      id: '6',
      fullName: 'Vũ Thị Phương',
      email: 'vuthiphuong@company.vn',
      phone: '0956789012',
      address: '987 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh',
      role: 'Nhân viên',
      status: 'active',
      createdDate: '2024-05-15',
    },
    {
      id: '7',
      fullName: 'Đặng Quốc Hùng',
      email: 'dangquochung@company.vn',
      phone: '0967890123',
      address: '246 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
      role: 'Trưởng phòng',
      status: 'inactive',
      createdDate: '2023-12-01',
    },
    {
      id: '8',
      fullName: 'Bùi Thị Giang',
      email: 'buithigiang@company.vn',
      phone: '0978901234',
      address: '135 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh',
      role: 'Kế toán',
      status: 'active',
      createdDate: '2024-06-20',
    },
  ];

  getUsers(): Observable<User[]> {
    // TODO: replace with this.http.get<User[]>(this.API_URL)
    return of(this.mockUsers).pipe(delay(600));
  }

  getUserById(id: string): Observable<User> {
    const user = this.mockUsers.find((u) => u.id === id);
    if (!user) return throwError(() => new Error('User not found'));
    // TODO: replace with this.http.get<User>(`${this.API_URL}/${id}`)
    return of(user).pipe(delay(400));
  }
}
