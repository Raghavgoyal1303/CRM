import React, { useState, useEffect, useMemo } from 'react';
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
  Maximize2,
  ExternalLink,
  Tag,
  DollarSign,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { propertyApi } from '../../api';

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
      setProperties(data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.price).includes(searchTerm)
    );
  }, [properties, searchTerm]);

  const handleEdit = (e, prop) => {
    e.stopPropagation(); // Don't trigger Detail Modal
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
    
    // Always use FormData for consistency with Multer
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
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
      alert('Action failed. Likely a connection or data issue.');
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
    e.stopPropagation(); // Don't trigger Detail Modal
    if (!window.confirm('Are you sure you want to remove this property?')) return;
    try {
      await propertyApi.delete(id);
      fetchProperties();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  const isVideo = (path) => {
    if (!path) return false;
    const ext = path.split('.').pop().toLowerCase();
    return ['mp4', 'mov', 'webm', 'ogg'].includes(ext);
  };

  const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="p-8 max-w-7xl mx-auto font-heading pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-indigo-950 tracking-tight flex items-center gap-3">
            Inventory <span className="text-primary/40">Portal</span>
          </h1>
          <p className="text-[#6B7280] font-medium mt-2">Manage listings, track visibility, and explore properties in detail.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name, sector, price..."
              className="bg-white h-14 pl-12 pr-6 rounded-2xl w-[350px] border border-gray-100 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary text-white h-14 px-8 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95"
          >
            <Plus size={20} /> List New Property
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white h-[450px] rounded-[40px] animate-pulse border border-gray-100" />
          ))}
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
                className="group cursor-pointer bg-white rounded-[40px] overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              >
                <div className="relative h-64 bg-gray-100">
                  {mediaUrl ? (
                    isVideo(firstFile) ? (
                      <video 
                        src={mediaUrl} 
                        muted 
                        loop 
                        onMouseOver={(e) => e.target.play()} 
                        onMouseOut={(e) => e.target.pause()}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img src={mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prop.name} />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon size={64} />
                    </div>
                  )}
                  
                  <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleEdit(e, prop)}
                      className="p-3 bg-white/90 backdrop-blur-md text-indigo-900 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-all scale-90 hover:scale-100"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, prop.id)}
                      className="p-3 bg-white/90 backdrop-blur-md text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all scale-90 hover:scale-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg backdrop-blur-md ${prop.ownership === 'Our Project' ? 'bg-indigo-600/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                      {prop.ownership}
                    </div>
                    {prop.visibility === 'private' && (
                       <div className="p-1.5 rounded-full bg-rose-500/90 text-white shadow-lg backdrop-blur-md">
                          <EyeOff size={12} />
                       </div>
                    )}
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                     <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-indigo-900 uppercase tracking-widest shadow-xl flex items-center gap-2">
                        View Details <Maximize2 size={12} />
                     </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-black text-indigo-950 truncate">{prop.name}</h3>
                    <div className="badge bg-status-site-visit-bg text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase">
                       {prop.property_type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#6B7280] font-medium mb-6">
                    <MapPin size={16} className="text-primary/40" />
                    <span className="text-sm">{prop.location}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="text-2xl font-black text-indigo-900">
                       ₹{(prop.price/100000).toFixed(1)}<span className="text-sm text-gray-400 font-bold tracking-tighter ml-1">Lac+</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl">
                       <ImageIcon size={12}/> {media.length} 
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 backdrop-blur-xl bg-indigo-950/40">
           <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[40px] shadow-3xl overflow-hidden flex flex-col lg:flex-row relative animate-in zoom-in duration-300">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-8 right-8 z-[110] w-12 h-12 bg-white/20 hover:bg-white text-white hover:text-indigo-950 flex items-center justify-center rounded-2xl backdrop-blur-md transition-all shadow-xl"
              >
                 <X size={24} />
              </button>

              {/* MEDIA SECTION */}
              <div className="flex-[3] bg-indigo-950 relative overflow-hidden flex items-center justify-center group/slider">
                 {(() => {
                   const media = typeof selectedProperty.media === 'string' ? JSON.parse(selectedProperty.media || '[]') : (selectedProperty.media || []);
                   if (media.length === 0) {
                     return <div className="text-indigo-800"><Building2 size={120} /></div>;
                   }
                   const currentUrl = `${getBaseUrl()}${media[activeMediaIdx]}`;
                   return (
                     <>
                        {isVideo(media[activeMediaIdx]) ? (
                          <video src={currentUrl} controls autoPlay className="w-full h-full object-contain" />
                        ) : (
                          <img src={currentUrl} className="w-full h-full object-contain" alt="Property slide" />
                        )}
                        
                        {media.length > 1 && (
                          <>
                            <button 
                              onClick={() => setActiveMediaIdx((activeMediaIdx - 1 + media.length) % media.length)}
                              className="absolute left-6 w-14 h-14 bg-white/10 hover:bg-white/90 text-white hover:text-indigo-950 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100"
                            >
                               <ChevronLeft size={32} />
                            </button>
                            <button 
                              onClick={() => setActiveMediaIdx((activeMediaIdx + 1) % media.length)}
                              className="absolute right-6 w-14 h-14 bg-white/10 hover:bg-white/90 text-white hover:text-indigo-950 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/slider:opacity-100"
                            >
                               <ChevronRight size={32} />
                            </button>
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                               {media.map((_, i) => (
                                 <div 
                                   key={i} 
                                   className={`h-1 rounded-full transition-all ${i === activeMediaIdx ? 'w-12 bg-white' : 'w-4 bg-white/30'}`} 
                                 />
                               ))}
                            </div>
                          </>
                        )}
                     </>
                   );
                 })()}
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-[2] flex flex-col border-l border-gray-50 h-full">
                 <div className="p-10 lg:p-14 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex items-center gap-2 mb-6">
                       <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">{selectedProperty.ownership}</span>
                       <span className="px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest">{selectedProperty.property_type}</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-black text-indigo-950 tracking-tighter leading-none mb-4">{selectedProperty.name}</h2>
                    
                    <div className="flex items-center gap-3 text-indigo-600/60 font-medium mb-10">
                       <MapPin size={24} />
                       <span className="text-lg">{selectedProperty.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                       <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign size={10} /> Market Price</p>
                          <p className="text-2xl font-black text-indigo-950">₹{(selectedProperty.price/100000).toFixed(1)} Lac+</p>
                       </div>
                       <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Calendar size={10} /> Listed Date</p>
                          <p className="text-lg font-black text-indigo-950">{new Date(selectedProperty.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' })}</p>
                       </div>
                    </div>

                    <div className="mb-12">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Info size={12} /> Detailed Description</p>
                       <p className="text-[#6B7280] text-lg leading-relaxed font-medium">
                          {selectedProperty.description || "No specific features highlighted for this inventory item."}
                       </p>
                    </div>
                 </div>

                 <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex gap-4">
                    <button 
                      onClick={() => handleEdit({ stopPropagation: () => {} }, selectedProperty)}
                      className="flex-1 bg-white border border-gray-200 text-indigo-950 h-16 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                    >
                       Edit Inventory
                    </button>
                    <button 
                      className="flex-1 bg-primary text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all"
                    >
                       Share Listing
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* FORM MODAL (ADD / EDIT) */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 backdrop-blur-sm bg-indigo-950/20">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300 h-[90vh] flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between shrink-0">
              <h2 className="text-3xl font-black text-indigo-950">
                {editingId ? 'Modify Record' : 'Create Inventory'} <span className="text-primary/40">Item</span>
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-gray-50 rounded-full transition-all text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Property Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Skyline Tower..."
                      className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Location / Sector</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Mohali, Phase 7..."
                      className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="Price"
                        className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Unit Type</label>
                      <select 
                        className="w-full h-14 bg-[#F9FAFB] border-0 rounded-2xl px-6 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                        value={formData.property_type}
                        onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                      >
                        <option>Flat</option>
                        <option>Villa</option>
                        <option>Plot</option>
                        <option>Commercial</option>
                        <option>Penthouse</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Visibility & Privacy</label>
                    <div className="flex gap-2">
                       {[
                         { val: 'public', label: 'Public', icon: Eye },
                         { val: 'private', label: 'Private (Only Me)', icon: EyeOff }
                       ].map(opt => (
                         <button
                           key={opt.val}
                           type="button"
                           onClick={() => setFormData({...formData, visibility: opt.val})}
                           className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all flex items-center justify-center gap-2 ${formData.visibility === opt.val ? 'bg-indigo-900 border-indigo-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                         >
                           <opt.icon size={14} /> {opt.label}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Project Range</label>
                    <div className="flex gap-2">
                       {['Our Project', 'Third-party'].map(type => (
                         <button
                           key={type}
                           type="button"
                           onClick={() => setFormData({...formData, ownership: type})}
                           className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${formData.ownership === type ? 'bg-indigo-900 border-indigo-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-2 px-1 text-center lg:text-left">Summary</label>
                    <textarea 
                      rows="3" 
                      className="w-full bg-[#F9FAFB] border-0 rounded-2xl px-6 py-4 font-medium text-indigo-950 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                      placeholder="Highlights..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* MEDIA UPLOAD SECTION */}
              <div className="mb-12">
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-4 px-1 text-center">Multi-media (Photos & Videos)</label>
                <div className="border-2 border-dashed border-gray-100 rounded-[30px] p-8 text-center hover:bg-indigo-50/30 transition-all group">
                   <input 
                     type="file" 
                     multiple 
                     accept="image/*,video/*"
                     className="hidden" 
                     id="media-upload" 
                     onChange={handleFileChange}
                   />
                   <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <ImageIcon size={32}/>
                      </div>
                      <div className="text-sm font-bold text-indigo-950">Click to upload files</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">Images & Videos Supported (Max 50MB)</div>
                   </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-8">
                     {selectedFiles.map((file, i) => (
                       <div key={i} className="relative aspect-square rounded-2xl bg-gray-50 overflow-hidden group">
                          {file.type.startsWith('video/') ? (
                            <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          ) : (
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                          )}
                          <button 
                            type="button"
                            onClick={() => removeFile(i)}
                            className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X size={20} />
                          </button>
                       </div>
                     ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-50 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {isSubmitting ? 'Sycing Database...' : (editingId ? 'Save Changes' : 'Confirm Listing')}
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
