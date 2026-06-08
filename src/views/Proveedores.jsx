import React, { useState, useEffect } from 'react';
import { supabase } from "../database/supabaseconfig";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre_empresa', { ascending: true });

      if (error) throw error;
      setProveedores(data || []);
    } catch (error) {
      console.error('Error al cargar proveedores:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const { error } = await supabase
          .from('proveedores')
          .update({
            nombre_empresa: formData.nombre_empresa,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion
          })
          .eq('proveedor_id', editandoId);

        if (error) throw error;
        alert('¡Proveedor actualizado con éxito!');
        setEditandoId(null);
      } else {
        const { error } = await supabase
          .from('proveedores')
          .insert([{
            nombre_empresa: formData.nombre_empresa,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
            activo: true // Por defecto nuevo proveedor está activo
          }]);

        if (error) throw error;
        alert('¡Proveedor registrado con éxito!');
      }

      setFormData({ nombre_empresa: '', telefono: '', email: '', direccion: '' });
      cargarProveedores();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEditClick = (prov) => {
    setEditandoId(prov.proveedor_id);
    setFormData({
      nombre_empresa: prov.nombre_empresa,
      telefono: prov.telefono,
      email: prov.email || '',
      direccion: prov.direccion || ''
    });
  };

  // NUEVA TAREA 4: Desactivar Proveedor (cambia activo a false)
  const handleDesactivar = async (id) => {
    const confirmar = window.confirm("¿Desactivar este proveedor?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('proveedores')
        .update({ activo: false })
        .eq('proveedor_id', id);

      if (error) throw error;
      alert('Proveedor desactivado correctamente.');
      cargarProveedores();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="container mt-4 text-start">
      <h2 className="mb-4">Módulo de Proveedores</h2>
      
      <div className="card p-4 shadow-sm mb-5">
        <h4 className="card-title">{editandoId ? 'Editar Proveedor' : 'Registrar un nuevo proveedor'}</h4>
        <form onSubmit={handleSubmit} className="row g-3 mt-2">
          {/* ... inputs iguales a los que tenías ... */}
          <div className="col-md-6"><label className="form-label">Nombre</label><input type="text" className="form-control" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} required /></div>
          <div className="col-md-6"><label className="form-label">Teléfono</label><input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required /></div>
          <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} /></div>
          <div className="col-md-6"><label className="form-label">Dirección</label><input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} /></div>
          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-primary">{editandoId ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>

      <div className="card p-4 shadow-sm">
        <h4>Lista de Proveedores</h4>
        <table className="table">
          <thead>
            <tr><th>Empresa</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.proveedor_id} className={!prov.activo ? "table-secondary" : ""}>
                <td>{prov.nombre_empresa}</td>
                <td>{prov.telefono}</td>
                <td>{prov.activo ? <span className="badge bg-success">Activo</span> : <span className="badge bg-secondary">Inactivo</span>}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditClick(prov)}>Editar</button>
                  {prov.activo && (
                    <button className="btn btn-sm btn-outline-warning" onClick={() => handleDesactivar(prov.proveedor_id)}>Desactivar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;