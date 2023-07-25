export const selectFieldsOfOrder = {
  id: true,
  name: true,
  surname: true,
  email: true,
  phone: true,
  age: true,
  course: true,
  course_format: true,
  course_type: true,
  sum: true,
  already_paid: true,
  created_at: true,
  utm: true,
  msg: true,
  status: true,
  group: true,
  manager: {
    select: {
      name: true,
    },
  },
};

export const selectFieldsOfManager = {
  id: true,
  name: true,
  surname: true,
  email: true,
  last_login: true,
  status: true,
  is_active: true,
};