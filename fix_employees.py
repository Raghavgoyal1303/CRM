import sys

file_path = r'c:\Users\Raghav Goyal\OneDrive\Desktop\CRM\frontend\src\pages\EmployeesPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''                     <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                        <input 
                         required
                         type="email" 
                         placeholder="rahul@crm.com"
                         className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                         value={formData.email}
                         onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                     </div>'''

replacement = '''                     <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Login Prefix</label>
                        <div className="flex items-center gap-0">
                           <input 
                            required
                            type="text" 
                            placeholder="firstname123"
                            className="flex-1 bg-[#F9F7F4] border border-[#F0EEF8] rounded-l-[16px] px-4 py-3.5 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border-r-0"
                            value={emailPrefix}
                            onChange={e => setEmailPrefix(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                           />
                           <div className="bg-indigo-50 border border-[#F0EEF8] rounded-r-[16px] px-4 py-3.5 text-xs font-black text-indigo-600 border-l-0">
                              {companySuffix}
                           </div>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 ml-1 italic font-medium">Must start with employee's first name</p>
                     </div>'''

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replacement successful")
else:
    # Try finding with flexible whitespace if exact match fails
    import re
    # Escape target for regex but allow for flexible whitespace
    # This is a bit complex, let's just try to find a smaller piece first
    if 'placeholder="rahul@crm.com"' in content:
        print("Found placeholder, but exact block match failed. Manual check needed.")
    else:
        print("Target NOT found at all.")
