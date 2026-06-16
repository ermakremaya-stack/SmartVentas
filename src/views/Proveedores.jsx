import React, { useState, useEffect } from 'react';
import { supabase } from "../database/supabaseconfig";
import "../App.css";
import TablaProveedores from '../components/proveedor/TablaProveedores';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre_empresa: '', telefono: '', email: '', direccion: ''
  });

  useEffect(() => { cargarProveedores(); }, []);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase.from('proveedores').select('*').order('nombre_empresa', { ascending: true });
      if (error) throw error;
      setProveedores(data || []);
    } catch (error) { console.error('Error:', error.message); }
    finally { setCargando(false); }
  };

  const handleNuevoClick = () => {
    setFormData({ nombre_empresa: '', telefono: '', email: '', direccion: '' });
    setEditandoId(null);
    setMostrarModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const { error } = await supabase.from('proveedores').update({
          nombre_empresa: formData.nombre_empresa, telefono: formData.telefono,
          email: formData.email, direccion: formData.direccion
        }).eq('proveedor_id', editandoId);
        if (error) throw error;
        alert('¡Actualizado!');
        setEditandoId(null);
      } else {
        const { error } = await supabase.from('proveedores').insert([{
          ...formData, activo: true
        }]);
        if (error) throw error;
        alert('¡Registrado!');
      }
      setFormData({ nombre_empresa: '', telefono: '', email: '', direccion: '' });
      setMostrarModal(false);
      cargarProveedores();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleEditClick = (prov) => {
    setEditandoId(prov.proveedor_id);
    setFormData({ nombre_empresa: prov.nombre_empresa, telefono: prov.telefono, email: prov.email || '', direccion: prov.direccion || '' });
    setMostrarModal(true);
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm("¿Desactivar este proveedor?")) return;
    const { error } = await supabase.from('proveedores').update({ activo: false }).eq('proveedor_id', id);
    if (error) alert(error.message); else cargarProveedores();
  };

  const handleActivar = async (id) => {
    const { error } = await supabase.from('proveedores').update({ activo: true }).eq('proveedor_id', id);
    if (error) alert(error.message); else cargarProveedores();
  };

  return (
    <div className="container mt-4 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Módulo de Proveedores</h2>
        <button className="btn btn-primary" onClick={handleNuevoClick}>
          + Nuevo Proveedor
        </button>
      </div>

      {/* --- MODAL --- */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h4>{editandoId ? 'Editar Proveedor' : 'Registrar un nuevo proveedor'}</h4>
              <form onSubmit={handleSubmit} className="row g-3 mt-2">
                <div className="col-md-6"><label>Nombre</label><input className="form-control" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} required /></div>
                <div className="col-md-6"><label>Teléfono</label><input className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required /></div>
                <div className="col-md-6"><label>Email</label><input className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
                <div className="col-md-6"><label>Dirección</label><input className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} /></div>
                <div className="d-flex justify-content-end mt-3">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setMostrarModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">{editandoId ? 'Actualizar' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 shadow-sm">
        <TablaProveedores
          proveedores={proveedores}
          handleEditClick={handleEditClick}
          handleDesactivar={handleDesactivar}
          handleActivar={handleActivar}
        />
      </div>
    </div>
  );
};

export default Proveedores;