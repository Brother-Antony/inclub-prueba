import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = 'https://jsonplaceholder.typicode.com/users';

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      name: '',
      username: '',
      phone: '',
      email: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({data: response.data});
      // console.log(response.data)
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionPost = async () => {
    delete this.state.form.id;

    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    });
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id).then(response => {
      this.setState({modalEliminar: false});
      this.peticionGet();
    });
  }

  modalInsertar = () => {
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarEmpresa = (empresa) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: empresa.id,
        name: empresa.name,
        username: empresa.username,
        phone: empresa.phone,
        email: empresa.email
      }
    });
  }

  handleChange = async e => {
    e.persist();

    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });

    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const {form} = this.state;

    return (
      <div className="App">
        <br/>
        <button className='btn btn-success' onClick={() => {this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar</button>
        <br/><br/>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nombre de usuario</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {this.state.data.map(empresa => {
              return (
                <tr>
                  <td>{empresa.id}</td>
                  <td>{empresa.name}</td>
                  <td>{empresa.username}</td>
                  <td>{empresa.phone}</td>
                  <td>{empresa.email}</td>
                  <td>
                    <button className='btn btn-primary' onClick={() => {this.seleccionarEmpresa(empresa); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit} /></button>
                    {" "}
                    <button className='btn btn-danger' onClick={() => {this.seleccionarEmpresa(empresa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>

          <ModalBody>
            <div className='for-group'>
              <label htmlFor='id'>ID</label>
              <input className='form-control' type='text' name='id' id='id' readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}></input>
              <br/>
              <label htmlFor='nombre'>Nombre</label>
              <input className='form-control' type='text' name='name' id='name' onChange={this.handleChange} value={form?form.name: ''}></input>
              <br/>
              <label htmlFor='nombre'>Nombre de usuario</label>
              <input className='form-control' type='text' name='username' id='username' onChange={this.handleChange} value={form?form.username: ''}></input>
              <br/>
              <label htmlFor='nombre'>Teléfono</label>
              <input className='form-control' type='text' name='phone' id='phone' onChange={this.handleChange} value={form?form.phone: ''}></input>
              <br/>
              <label htmlFor='nombre'>Email</label>
              <input className='form-control' type='email' name='email' id='email' onChange={this.handleChange} value={form?form.email: ''}></input>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className='btn btn-success' onClick={() => this.peticionPost()}>Insertar</button>
              :
              <button className='btn btn-primary' onClick={() => this.peticionPut()}>Actualizar</button>
            }

            <button className='btn btn-danger' onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar la lista {form && form.name}
          </ModalBody>

          <ModalFooter>
            <button className='btn btn-danger' onClick={() => this.peticionDelete()}>Sí</button>
            <button className='btn btn-secundary' onClick={() => this.setState({modalEliminar: false})}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
