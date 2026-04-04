const mockData = require('./mockData');

class MockDatabase {
  constructor() {
    this.data = JSON.parse(JSON.stringify(mockData));
    // Re-attach live bcrypt hashes (lost in JSON parse)
    this.data.employees = mockData.employees;
  }

  async query(text, params = []) {
    const q = text.trim().toLowerCase();

    // --- TRANSACTION COMMANDS ---
    if (q === 'begin' || q === 'commit' || q === 'rollback') return { rows: [] };

    // =================================================================
    // COMPANIES
    // =================================================================
    if (q.includes('from companies')) {
      // Aggregate stats (platform dashboard)
      if (q.includes('sum(case when subscription_status')) {
        const companies = this.data.companies;
        return { rows: [{
          total:     companies.length,
          active:    companies.filter(c => c.subscription_status === 'active').length,
          trial:     companies.filter(c => c.subscription_status === 'trial').length,
          suspended: companies.filter(c => c.subscription_status === 'suspended').length,
        }]};
      }
      // Single company by id
      if (q.includes('where id = ?')) {
        const c = this.data.companies.find(c => c.id === params[0]);
        return { rows: c ? [c] : [] };
      }
      // max_employees for limit check
      if (q.includes('select max_employees')) {
        const c = this.data.companies.find(c => c.id === params[0]);
        return { rows: c ? [{ max_employees: c.max_employees }] : [] };
      }
      // All companies
      return { rows: [...this.data.companies].sort((a,b) => b.created_at - a.created_at) };
    }

    // =================================================================
    // EMPLOYEES
    // =================================================================
    if (q.includes('from employees')) {
      let filtered = [...this.data.employees];

      if (q.includes('where email = ?')) {
        const user = filtered.find(e => e.email === params[0]);
        return { rows: user ? [user] : [] };
      }
      if (q.includes('where company_id = ?') && q.includes('and role = ?')) {
        filtered = filtered.filter(e => e.company_id === params[0] && e.role === params[1]);
        return { rows: filtered };
      }
      if (q.includes('where company_id = ?') && q.includes('order by')) {
        filtered = filtered.filter(e => e.company_id === params[0]);
        return { rows: filtered };
      }
      if (q.includes('where company_id = ?')) {
        filtered = filtered.filter(e => e.company_id === params[0]);
        return { rows: filtered };
      }
      if (q.includes('where id = ?')) {
        const emp = filtered.find(e => e.id === params[0]);
        return { rows: emp ? [emp] : [] };
      }
      // Count employees
      if (q.includes('count(*)') && q.includes('where company_id = ?')) {
        const count = filtered.filter(e => e.company_id === params[0]).length;
        return { rows: [{ count }] };
      }
      return { rows: filtered };
    }

    // =================================================================
    // LEADS
    // =================================================================
    if (q.includes('from leads')) {
      let filtered = [...this.data.leads];
      let companyFilter = null;

      // extract company_id param
      if (q.includes('where company_id = ?')) {
        companyFilter = params[0];
        filtered = filtered.filter(l => l.company_id === companyFilter);
      }

      // COUNT aggregate
      if (q.includes('count(*)')) {
        // status filter
        if (q.match(/and status = \?/)) {
          const statusParam = params[params.length - 1];
          filtered = filtered.filter(l => l.status === statusParam);
        }
        // date filter (skip for mock - just return full count)
        return { rows: [{ count: filtered.length, total: filtered.length, totalLeads: filtered.length }] };
      }

      // GROUP BY status
      if (q.includes('group by status')) {
        const grouped = {};
        filtered.forEach(l => { grouped[l.status] = (grouped[l.status] || 0) + 1; });
        return { rows: Object.entries(grouped).map(([status, count]) => ({ status, count })) };
      }

      // assigned_to filter
      if (q.includes('and assigned_to = ?')) {
        filtered = filtered.filter(l => l.assigned_to === params[1]);
      }

      // single lead by id
      if (q.includes('where id = ?')) {
        const lead = this.data.leads.find(l => l.id === params[0]);
        return { rows: lead ? [lead] : [] };
      }

      return { rows: filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
    }

    // =================================================================
    // CALL LOGS
    // =================================================================
    if (q.includes('from call_logs')) {
      if (q.includes('count(*)')) {
        return { rows: [{ count: 0, total: 0 }] };
      }
      return { rows: this.data.call_logs || [] };
    }

    // =================================================================
    // ASSIGNMENT POINTERS
    // =================================================================
    if (q.includes('from assignment_pointers')) {
      const ptr = this.data.assignment_pointers.find(p => p.company_id === params[0]);
      return { rows: ptr ? [ptr] : [] };
    }

    // =================================================================
    // INSERTS
    // =================================================================
    if (q.startsWith('insert into companies')) {
      const [id, name, owner_name, email, phone, max_employees] = params;
      const newComp = {
        id, name, owner_name, email, phone,
        max_employees: max_employees || 5,
        subscription_status: 'trial',
        created_at: new Date()
      };
      this.data.companies.push(newComp);
      return { rows: [newComp] };
    }

    if (q.startsWith('insert into employees')) {
      const [id, company_id, name, email, phone_number, password_hash, role] = params;
      const newEmp = { id, company_id, name, email, phone_number, password_hash, role, is_active: true, created_at: new Date() };
      this.data.employees.push(newEmp);
      return { rows: [newEmp] };
    }

    if (q.startsWith('insert into leads')) {
      const newLead = {
        id: `lead-${Date.now()}`,
        company_id: params[0],
        phone_number: params[1],
        assigned_to: params[2],
        status: 'new',
        created_at: new Date(),
        updated_at: new Date()
      };
      this.data.leads.push(newLead);
      return { rows: [newLead] };
    }

    // =================================================================
    // UPDATES
    // =================================================================
    if (q.startsWith('update companies set subscription_status')) {
      const comp = this.data.companies.find(c => c.id === params[1]);
      if (comp) comp.subscription_status = params[0];
      return { rows: comp ? [comp] : [] };
    }

    if (q.startsWith('update leads set status')) {
      const lead = this.data.leads.find(l => l.id === params[1] && l.company_id === params[2]);
      if (lead) lead.status = params[0];
      return { rows: lead ? [lead] : [] };
    }

    if (q.startsWith('update leads set assigned_to')) {
      const lead = this.data.leads.find(l => l.id === params[1] && l.company_id === params[2]);
      if (lead) lead.assigned_to = params[0];
      return { rows: lead ? [lead] : [] };
    }

    if (q.startsWith('update assignment_pointers')) {
      const ptr = this.data.assignment_pointers.find(p => p.company_id === params[1]);
      if (ptr) ptr.last_index = params[0];
      return { rows: ptr ? [ptr] : [] };
    }

    if (q.startsWith('update employees')) {
      const emp = this.data.employees.find(e => e.id === params[params.length - 2] && e.company_id === params[params.length - 1]);
      if (emp) {
        emp.name       = params[0] ?? emp.name;
        emp.email      = params[1] ?? emp.email;
        emp.phone_number = params[2] ?? emp.phone_number;
        emp.role       = params[3] ?? emp.role;
        emp.is_active  = params[4] ?? emp.is_active;
      }
      return { rows: emp ? [emp] : [] };
    }

    // =================================================================
    // DELETES
    // =================================================================
    if (q.startsWith('delete from employees')) {
      const idx = this.data.employees.findIndex(e => e.id === params[0] && e.company_id === params[1]);
      if (idx > -1) this.data.employees.splice(idx, 1);
      return { rows: [] };
    }

    console.warn('[MockDB] Unhandled Query:', q.substring(0, 80), '| Params:', params);
    return { rows: [] };
  }
}

module.exports = new MockDatabase();
