const bcrypt = require('bcrypt');

const companies = [
  {
    id: 'comp-1',
    name: 'Elite Realty',
    owner_name: 'Priya Singh',
    email: 'priya@elite.com',
    phone: '+91 99999 88888',
    subscription_status: 'active',
    trial_ends_at: null,
    max_employees: 15,
    exotel_api_key: 'elite_key',
    exotel_api_token: 'elite_token',
    exotel_sid: 'elite_sid',
    created_at: new Date('2026-01-01')
  },
  {
    id: 'comp-2',
    name: 'Alpha Builders',
    owner_name: 'Ankit Kumar',
    email: 'ankit@alpha.com',
    phone: '+91 77777 66666',
    subscription_status: 'trial',
    trial_ends_at: new Date('2026-04-15'),
    max_employees: 5,
    exotel_api_key: 'alpha_key',
    exotel_api_token: 'alpha_token',
    exotel_sid: 'alpha_sid',
    created_at: new Date('2026-03-01')
  }
];

const employees = [
  {
    id: 'super-admin-id',
    company_id: null,
    name: 'Super Admin',
    email: 'you@leadflow.com',
    password_hash: bcrypt.hashSync('super123', 10),
    role: 'superadmin',
    is_active: true,
    created_at: new Date('2026-01-01')
  },
  {
    id: 'admin-id-1',
    company_id: 'comp-1',
    name: 'Rahul Sharma',
    email: 'rahul@crm.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    is_active: true,
    created_at: new Date('2026-01-05')
  },
  {
    id: 'emp-id-1',
    company_id: 'comp-1',
    name: 'Operative Alpha',
    email: 'alpha@crm.com',
    password_hash: bcrypt.hashSync('emp123', 10),
    role: 'employee',
    is_active: true,
    created_at: new Date('2026-01-10')
  }
];

const leads = [
  {
    id: 'lead-1',
    company_id: 'comp-1',
    phone_number: '+919876543210',
    name: 'Rahul Kumar',
    source: 'youtube',
    assigned_to: 'emp-id-1',
    status: 'new',
    created_at: new Date(),
    updated_at: new Date()
  }
];

const lead_notes = [];
const call_logs = [];
const assignment_pointers = [
  { company_id: 'comp-1', last_index: 0 },
  { company_id: 'comp-2', last_index: 0 }
];

module.exports = {
  companies,
  employees,
  leads,
  lead_notes,
  call_logs,
  assignment_pointers
};
