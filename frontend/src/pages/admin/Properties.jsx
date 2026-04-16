import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ExternalLink,
  Tag,
  DollarSign,
  User as UserIcon,
  Calendar,
  Download,
  Share2
} from 'lucide-react';
import api, { propertyApi } from '../../api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Hidden ref for PDF rendering (Standard HEX colors used here for jspdf compatibility)
  const pdfTemplateRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    property_type: 'Flat',
    ownership: 'Our Project',
    visibility: 'public',
    details: '{}'
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await propertyApi.getAll();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => 
      (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (p.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      String(p.price || '').includes(searchTerm)
    );
  }, [properties, searchTerm]);

  const handleEdit = (e, prop) => {
    e.stopPropagation();
    setEditingId(prop.id);
    setFormData({
      name: prop.name,
      description: prop.description,
      price: prop.price,
      location: prop.location,
      property_type: prop.property_type,
      ownership: prop.ownership,
      visibility: prop.visibility || 'public',
      details: typeof prop.details === 'string' ? prop.details : JSON.stringify(prop.details || {})
    });
    setSelectedFiles([]);
    setShowModal(true);
  };

  const openDetail = (prop) => {
    setSelectedProperty(prop);
    setActiveMediaIdx(0);
    setShowDetailModal(true);
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key] === null || formData[key] === undefined ? '' : formData[key]);
    });
    selectedFiles.forEach(file => data.append('media', file));

    try {
      if (editingId) {
        await propertyApi.update(editingId, data);
      } else {
        await propertyApi.create(data);
      }
      setShowModal(false);
      resetForm();
      fetchProperties();
    } catch (err) {
      alert(`Action failed: ${err.response?.data?.message || '500'}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      location: '',
      property_type: 'Flat',
      ownership: 'Our Project',
      visibility: 'public',
      details: '{}'
    });
    setSelectedFiles([]);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Remove listing?')) return;
    try {
      await propertyApi.delete(id);
      fetchProperties();
    } catch (err) {
      alert('Delete failed');
    }
  };

  /**
   * SUPER-STABLE PDF ENGINE
   * Renders a clean, hidden HTML template into a PDF using standard colors.
   */
  const downloadPDF = async () => {
    if (!selectedProperty) return;
    setIsGeneratingPdf(true);
    
    try {
      // 1. Give DOM a moment to ensure hidden template is ready
      const element = pdfTemplateRef.current;
      if (!element) throw new Error("PDF Template not loaded");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Manual style override to fix oklch/modern CSS issues during cloning
        onclone: (clonedDoc) => {
           const clonedEl = clonedDoc.getElementById('pdf-render-area');
           if (clonedEl) {
             clonedEl.style.display = 'block';
             const textToVanish = clonedEl.querySelectorAll('.oklch-fix');
             textToVanish.forEach(el => {
                el.style.color = '#1e1b4b'; // Force Deep Indigo
             });
           }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Tricity_Portfolio_${selectedProperty.name.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('PDF Stable Engine Error:', error);
      alert('PDF generation failed. Please use standard printer options (Ctrl+P) for this item.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isVideo = (path) => {
    if (!path) return false;
    const ext = path.split('.').pop().toLowerCase();
    return ['mp4', 'mov', 'webm', 'ogg'].includes(ext);
  };

  const getBaseUrl = () => {
    const baseUrl = api.defaults.baseURL || 'http://localhost:5000/api';
    return baseUrl.replace('/api', '');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-heading pb-32">
      {/* HIDDEN PDF TEMPLATE - Uses hardcoded HEX to bypass OKLCH issues */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
         <div 
           ref={pdfTemplateRef} 
           id="pdf-render-area" 
           style={{ width: '800px', background: '#ffffff', padding: '60px', color: '#1e1b4b' }}
         >
            <div style={{ borderBottom: '4px solid #3D52D5', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#3D52D5' }}>TRICITY VERIFIED</h1>
               <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: '#94a3b8', letterSpacing: '2px' }}>OFFICIAL INVENTORY REPORT</p>
            </div>

            {selectedProperty && (
               <>
                  {(() => {
                    const media = typeof selectedProperty.media === 'string' ? JSON.parse(selectedProperty.media || '[]') : (selectedProperty.media || []);
                    if (media.length > 0 && !isVideo(media[0])) {
                       return <img crossOrigin="anonymous" src={`${getBaseUrl()}${media[0]}`} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '30px', marginBottom: '40px' }} />;
                    }
                    return <div style={{ width: '100%', height: '200px', background: '#f8fafc', borderRadius: '30px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>Media Preview Attached in Digital Portfolio</div>;
                  })()}

                  <h2 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-2px' }}>{selectedProperty.name}</h2>
                  <p style={{ fontSize: '20px', color: '#64748b', marginBottom: '40px', fontWeight: 'bold' }}>{selectedProperty.location}</p>

                  <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                     <div style={{ flex: 1, background: '#f8fafc', padding: '30px', borderRadius: '25px', border: '1px solid #f1f5f9' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>VALUATION</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>₹{(selectedProperty.price/100000).toFixed(1)} Lac+</p>
                     </div>
                     <div style={{ flex: 1, background: '#f8fafc', padding: '30px', borderRadius: '25px', border: '1px solid #f1f5f9' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>CATEGORY</p>
                        <p style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>{selectedProperty.property_type}</p>
                     </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '40px' }}>
                     <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900', marginBottom: '20px' }}>REPRESENTATIVE SUMMARY</p>
                     <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>"{selectedProperty.description || "Premium verified listing within the strategic growth corridors of Tricity."}"</p>
                  </div>

                  <div style={{ marginTop: '80px', textAlign: 'center', color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>
                     Digitally authenticated by Tricity Verified CRM Ecosystem &copy; {new Date().getFullYear()}
                  </div>
               </>
            )}
         </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#1e1b4b] tracking-tight flex items-center gap-3">
            Inventory <span className="text-primary/40">Portal</span>
          </h1>
          <p className="text-[#6B7280] font-medium mt-2">Manage properties and generate professional branded reports.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Quick search..."
              className="bg-white h-14 pl-12 pr-6 rounded-2xl w-[300px] border border-gray-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-[#3D52D5] text-white h-14 px-8 rounded-2xl flex items-center gap-3 font-black uppercase text-xs"
          >
            <Plus size={20} /> Add Inventory
          </button>
        </div>
      </div>

      {/* GRID SECTION */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1,2,3].map(i => <div key={i} className="bg-white h-96 rounded-[40px] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => {
            const media = typeof prop.media === 'string' ? JSON.parse(prop.media || '[]') : (prop.media || []);
            const firstFile = media.length > 0 ? media[0] : null;
            const mediaUrl = firstFile ? `${getBaseUrl()}${firstFile}` : null;
            
            return (
              <div 
                key={prop.id} 
                onClick={() => openDetail(prop)}
                className="group cursor-pointer bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="relative h-64 bg-gray-100">
                  {mediaUrl ? (
                    isVideo(firstFile) ? (
                      <video src={mediaUrl} muted loop autoPlay className="w-full h-full object-cover" />
                    ) : (
                      <img src={mediaUrl} className="w-full h-full object-cover" alt={prop.name} />
                    )
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-300"><Building2 size={64} /></div>}
                  
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleEdit(e, prop)} className="p-3 bg-white text-[#1e1b4b] rounded-2xl shadow-xl hover:bg-[#3D52D5] hover:text-white transition-all"><Edit3 size={18} /></button>
                    <button onClick={(e) => handleDelete(e, prop.id)} className="p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-black text-[#1e1b4b] mb-2">{prop.name}</h3>
                  <div className="flex items-center gap-2 text-[#6B7280] mb-6">
                    <MapPin size={16} /> <span className="text-sm">{prop.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="text-2xl font-black text-[#1e1b4b]">₹{(prop.price/100000).toFixed(1)} Lac</div>
                    <div className="text-[10px] font-black text-white bg-[#1e1b4b] px-3 py-1 rounded-full uppercase">{prop.visibility}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
           <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[40px] shadow-3xl overflow-hidden flex flex-col lg:flex-row relative animate-in zoom-in duration-300">
              
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-8 right-8 z-[110] w-14 h-14 bg-white text-indigo-950 flex items-center justify-center rounded-2xl shadow-2xl"
              >
                 <X size={28} />
              </button>

              <div className="flex-[3] bg-[#0f172a] relative flex items-center justify-center">
                 {(() => {
                   const media = typeof selectedProperty.media === 'string' ? JSON.parse(selectedProperty.media || '[]') : (selectedProperty.media || []);
                   if (media.length === 0) return <Building2 size={120} className="text-white/10" />;
                   const currentUrl = `${getBaseUrl()}${media[activeMediaIdx]}`;
                   return (
                     <>
                        {isVideo(media[activeMediaIdx]) ? <video src={currentUrl} controls autoPlay className="w-full h-full object-contain" /> : <img src={currentUrl} className="w-full h-full object-contain" alt="Property slide" />}
                        {media.length > 1 && (
                          <>
                            <button onClick={() => setActiveMediaIdx((activeMediaIdx - 1 + media.length) % media.length)} className="absolute left-6 w-16 h-16 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all z-20"><ChevronLeft size={40} /></button>
                            <button onClick={() => setActiveMediaIdx((activeMediaIdx + 1) % media.length)} className="absolute right-6 w-16 h-16 bg-white/20 hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all z-20"><ChevronRight size={40} /></button>
                          </>
                        )}
                     </>
                   );
                 })()}
              </div>

              <div className="flex-[2] flex flex-col h-full bg-white">
                 <div className="p-10 lg:p-14 overflow-y-auto flex-1 bg-white custom-scrollbar">
                    <div className="flex gap-2 mb-6">
                       <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">{selectedProperty.ownership}</span>
                       <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">{selectedProperty.property_type}</span>
                    </div>
                    <h2 className="text-4xl font-black text-[#1e1b4b] mb-4 tracking-tighter leading-tight">{selectedProperty.name}</h2>
                    <div className="flex items-center gap-2 text-[#6B7280] mb-10 font-medium"><MapPin size={20}/> {selectedProperty.location}</div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-10">
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Market Price</p>
                          <p className="text-2xl font-black text-[#1e1b4b]">₹{(selectedProperty.price/100000).toFixed(1)} Lac+</p>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Listing Info</p>
                          <p className="text-lg font-black text-[#1e1b4b] uppercase">{selectedProperty.visibility}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Description</p>
                       <p className="text-[#6B7280] font-medium leading-relaxed text-lg italic">"{selectedProperty.description || "No specific features highlighted for this inventory item."}"</p>
                    </div>
                 </div>

                 <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-4">
                    <button 
                      onClick={downloadPDF} 
                      disabled={isGeneratingPdf} 
                      className="w-full bg-[#3D52D5] text-white h-16 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                       <Download size={18} /> {isGeneratingPdf ? 'Compiling Report...' : 'Download Report'}
                    </button>
                    <button className="w-full h-12 bg-[#1e1b4b] text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all opacity-50 cursor-not-allowed">
                       <Share2 size={16} /> WhatsApp Follow-up (Coming Soon)
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-sm bg-black/20">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden flex flex-col h-[90vh] animate-in zoom-in duration-300">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-3xl font-black text-[#1e1b4b] uppercase tracking-tighter">{editingId ? 'Modify' : 'Add New'} Portfolio Item</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-50 rounded-full"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                 <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block px-1">Inventory Name</label>
                      <input required className="w-full h-14 bg-gray-50 rounded-2xl px-6 outline-none font-medium text-indigo-950 focus:bg-indigo-50/50 transition-all border border-transparent focus:border-indigo-100" placeholder="Skyline Heights..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block px-1">Location Details</label>
                      <input required className="w-full h-14 bg-gray-50 rounded-2xl px-6 outline-none font-medium text-indigo-950 focus:bg-indigo-50/50 transition-all border border-transparent focus:border-indigo-100" placeholder="Sector 71, Mohali..." value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block px-1">Price (₹)</label>
                         <input type="number" className="w-full h-14 bg-gray-50 rounded-2xl px-6 outline-none font-medium text-indigo-950" placeholder="Amount" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                       </div>
                       <div>
                         <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block px-1">Visibility</label>
                         <select className="w-full h-14 bg-gray-50 rounded-2xl px-6 outline-none appearance-none font-black text-[#1e1b4b]" value={formData.visibility} onChange={(e) => setFormData({...formData, visibility: e.target.value})}>
                           <option value="public">🌍 Public Access</option>
                           <option value="private">🔒 Private Only</option>
                         </select>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block px-1">Detailed Description</label>
                     <textarea rows="9" className="w-full bg-gray-50 rounded-3xl p-6 outline-none resize-none font-medium text-[#475569] leading-relaxed" placeholder="Mention features like club house, gym, pool..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                 </div>
              </div>

              <div className="mb-12">
                 <input type="file" multiple accept="image/*,video/*" className="hidden" id="modal-upload" onChange={handleFileChange} />
                 <label htmlFor="modal-upload" className="w-full border-2 border-dashed border-indigo-50 rounded-[40px] p-12 flex flex-col items-center gap-4 cursor-pointer hover:bg-indigo-50/20 transition-all group">
                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-all">
                       <ImageIcon size={32} />
                    </div>
                    <span className="font-black text-indigo-950 uppercase text-xs tracking-widest">Select Portfolio Assets</span>
                 </label>
                 
                 {selectedFiles.length > 0 && (
                   <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-8">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group">
                           {file.type.startsWith('video/') ? (
                             <video src={URL.createObjectURL(file)} className="w-full h-full object-cover"/>
                           ) : (
                             <img src={URL.createObjectURL(file)} className="w-full h-full object-cover"/>
                           )}
                           <button type="button" onClick={() => removeFile(i)} className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                              <X size={24}/>
                           </button>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <div className="flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-100">
                 <button onClick={() => setShowModal(false)} type="button" className="flex-1 h-16 rounded-2xl font-black uppercase text-xs text-gray-400 hover:bg-gray-50">Discard</button>
                 <button type="submit" disabled={isSubmitting} className="flex-[2] bg-[#3D52D5] text-white h-16 rounded-2xl font-black uppercase text-xs shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all">
                   {isSubmitting ? 'Pushing to Database...' : (editingId ? 'Save Changes' : 'Publish Inventory')}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
