import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleEnum } from '../shared/enums/index.js';
import { BookingUnauthorizedException } from '../shared/exceptions/booking.exceptions.js';

type BookingAction = 'create' | 'cancel' | 'approve' | 'reject' | 'move' | 'update_attendance';

@Injectable()
export class RbacValidator {
  // T006, T022: Explicit action matrix per role
  validateAction(role: RoleEnum, action: BookingAction): void {
    const forbidden: Record<RoleEnum, BookingAction[]> = {
      [RoleEnum.USUARIO]: ['create', 'cancel', 'approve', 'reject', 'move', 'update_attendance'],
      [RoleEnum.ALUMNO]: ['approve', 'reject', 'move', 'update_attendance'],
      [RoleEnum.ADMIN]: [],
      [RoleEnum.SUPERADMIN]: [],
    };
    if (forbidden[role]?.includes(action)) {
      throw new BookingUnauthorizedException(`Rol '${role}' no puede ejecutar '${action}'`);
    }
  }

  // T019, T022: Admin can only act on bookings where they are the selected professor
  validateAdminScope(role: RoleEnum, actorId: Types.ObjectId, bookingProfessorId: Types.ObjectId): void {
    if (role === RoleEnum.ADMIN && actorId.toString() !== bookingProfessorId.toString()) {
      throw new BookingUnauthorizedException('El administrador solo puede modificar reservas donde fue seleccionado como profesor');
    }
  }
}
