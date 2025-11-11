// import { format } from 'date-fns';
// import {
//   RoutingStatusLabel,
//   RoutingStepStatusLabel,
//   UserTypeLabel,
//   VehicleTypeLabel,
//   WorkOrderStatusLabel,
//   WorkOrderTypeLabel,
// } from '../enums';

// const formatCurrency = (value: number): string =>
//   new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//   }).format(value);

// export const formatUtils = {
//   formatCurrency,
// };

// export const filterDataByColumns = <T extends Record<string, any>>(
//   columns: { key: string; header: string }[],
//   data: T[],
//   returnFullObject: boolean = false
// ): Partial<T>[] => {
//   const keys = columns.map((col) => col.key);

//   return data.map((item) => {
//     if (returnFullObject) {
//       return { ...item };
//     }

//     const filteredItem: Partial<T> = {};
//     keys.forEach((key) => {
//       if (key in item) {
//         (filteredItem as Record<string, any>)[key] = item[key];
//       }
//     });

//     return filteredItem;
//   });
// };

// export const mapCustomFields = <T extends Record<string, any>>(
//   data: T[],
//   entity:
//     | 'user'
//     | 'vehicle'
//     | 'routing'
//     | 'workOrder'
//     | 'routingStep'
//     | null = null
// ): T[] => {
//   const isActiveMap: Record<string, string> = {
//     true: 'ATIVO',
//     false: 'INATIVO',
//   };

//   return data.map((item) => {
//     const newItem = { ...item } as Record<string, any>;

//     if ('type' in newItem && typeof newItem['type'] === 'string') {
//       switch (entity) {
//         case 'user':
//           newItem['type'] =
//             UserTypeLabel.find((s) => s.value === newItem['type'])?.label ||
//             newItem['type'];
//           break;
//         case 'vehicle':
//           newItem['type'] =
//             VehicleTypeLabel.find((s) => s.value === newItem['type'])?.label ||
//             newItem['type'];
//           break;
//         case 'workOrder':
//           newItem['type'] =
//             WorkOrderTypeLabel.find((s) => s.value === newItem['type'])
//               ?.label || newItem['type'];
//           break;
//         default:
//           newItem['type'] = newItem['type'].toUpperCase();
//       }
//     }

//     if ('isActive' in newItem && typeof newItem['isActive'] === 'boolean') {
//       newItem['isActive'] = isActiveMap[String(newItem['isActive'])];
//     }

//     if ('status' in newItem && typeof newItem['status'] === 'string') {
//       switch (entity) {
//         case 'routing':
//           newItem['status'] =
//             RoutingStatusLabel.find((s) => s.value === newItem['status'])
//               ?.label || newItem['status'];
//           break;
//         case 'workOrder':
//           newItem['status'] =
//             WorkOrderStatusLabel.find((s) => s.value === newItem['status'])
//               ?.label || newItem['status'];
//           break;
//         case 'routingStep':
//           newItem['status'] =
//             RoutingStepStatusLabel.find((s) => s.value === newItem['status'])
//               ?.label || newItem['status'];
//           break;
//         default:
//           newItem['status'] = newItem['status'].toUpperCase();
//       }
//     }

//     for (const prop in newItem) {
//       if (prop.includes('Date')) {
//         const value = newItem[prop];
//         if (
//           typeof value === 'string' &&
//           value.split('-').length === 3 &&
//           value.length === 10
//         ) {
//           newItem[prop] = format(new Date(`${value} 00:00:00`), 'dd/MM/yyyy');
//         } else if (
//           typeof value === 'string' &&
//           value.split('T').length === 2 &&
//           value.length > 20
//         ) {
//           newItem[prop] = format(new Date(value), 'dd/MM/yyyy HH:mm');
//         }
//       } else if (prop.includes('Price') || prop.includes('price')) {
//         if (!isNaN(Number(newItem[prop]))) {
//           const value = Number(newItem[prop]);
//           newItem[prop] = formatCurrency(value);
//         }
//       } else if (prop.includes('Quantity') || prop.includes('quantity')) {
//         if (!isNaN(Number(newItem[prop]))) {
//           newItem[prop] = `${newItem[prop]}`;
//         }
//       }
//     }

//     if ('createdAt' in newItem && newItem['createdAt']) {
//       newItem['createdAt'] = format(
//         new Date(newItem['createdAt']),
//         'dd/MM/yyyy HH:mm'
//       );
//     }

//     if ('updatedAt' in newItem && newItem['updatedAt']) {
//       newItem['updatedAt'] = format(
//         new Date(newItem['updatedAt']),
//         'dd/MM/yyyy HH:mm'
//       );
//     }

//     return newItem as T;
//   });
// };
