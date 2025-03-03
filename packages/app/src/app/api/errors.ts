export const API_ERRORS = {
  // Auth
  invalid_credentials: {
    code: 'invalid_credentials',
    message: 'Invalid credentials',
  },
  user_not_found: {
    code: 'user_not_found',
    message: 'User not found',
  },
  incomplete_data: {
    code: 'incomplete_data',
    message: 'Incomplete data',
  },
  password_too_short: {
    code: 'password_too_short',
    message: 'Password is too short',
  },
  user_already_exists: {
    code: 'user_already_exists',
    message: 'User already exists',
  },

  // Tasks
  failed_to_create_task: {
    code: 'failed_to_create_task',
    message: 'Failed to create task',
  },
  task_not_found: {
    code: 'task_not_found',
    message: 'Task not found',
  },
  failed_to_update_task: {
    code: 'failed_to_update_task',
    message: 'Failed to update task',
  },
  failed_to_delete_task: {
    code: 'failed_to_delete_task',
    message: 'Failed to delete task',
  },

  // Other
  unknown_error: {
    code: 'unknown_error',
    message: 'Unknown error',
  },
} as const

export type ErrorType = keyof typeof API_ERRORS
