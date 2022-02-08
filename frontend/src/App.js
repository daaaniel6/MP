import './App.css';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Component } from 'react';
//use efecct
import { useEffect } from 'react';

import CreatableSelect from "react-select/creatable";
const options = [
  { idTelephone: "red", name: "rojo", description: "#FF5630", telephoneNumber: "12345646" }
];

const url = "http://localhost:8080/api/prosecution";
const urlDepartaments = "http://localhost:8080/api/departament";
const url2 = "https://jsonplaceholder.typicode.com/users";

class App extends Component {


  state = {
    data: [],
    departaments: [],
    municipalities: [{}],

    modalInsertar: false,
    modalEliminar: false,
    form: {
      idProsecution: '',
      name: '',
      tel: '',
      departament: '',
      municipality: '',
      direction: '',
      telephones: '',
    }
  }

  peticionGet = () => {

    axios.get(url).then(response => {
      //console.log(response.data);
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  getAllDepartaments = () => {

    axios.get(urlDepartaments).then(response => {
      this.setState({ departaments: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.idProsecution;
    delete this.state.form.departament;
    //delete this.state.form.municpality;
    console.log(this.state.form);
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPut = () => {
    console.log(this.state.form);
    axios.put(url + "/" + this.state.form.idProsecution, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(url + "/" + this.state.form.idProsecution).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarEmpresa = (prosecution) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        idProsecution: prosecution.idProsecution,
        name: prosecution.name,
        municipality: prosecution.municipality,
        direction: prosecution.direction,
        tel: prosecution.tel,
      }
    })
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    if (this.state.municipalities != undefined) {
      const index = this.state.departaments.findIndex(x => x.idDepartament == this.state.form.departament);
      this.state.municipalities = this.state.departaments[index].municipalityCollection;
      this.setState({ municipalities: this.state.municipalities });
    }


    // console.log(this.state.form.municipality);
    // const i = this.state.municipalities.findIndex(x => x.idMunicipality == this.state.form.municipality);
    // console.log(i);
    // const muni = this.state.municipalities[i];
    // console.log(muni);
    // this.state.form.municipality = muni;
    // console.log(this.state.form);

  }

  //change
  handleChangeSelect = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    //this.setState({ form: { ...this.state.form.telephones = newValue } });
    console.log(this.state.form);
  };



  componentDidMount() {
    this.peticionGet();
    this.getAllDepartaments();

  }

  render() {
    const { form } = this.state;

    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Empresa</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Municipio</th>
              <th>Nombre</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(prosecution => {
              return (
                <tr key={prosecution.idProsecution}>
                  <td>{prosecution.idProsecution}</td>
                  <td>{prosecution.municipality.name}</td>
                  <td>{prosecution.name}</td>
                  <td>{prosecution.direction}</td>
                  <td>{prosecution.tel}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarEmpresa(prosecution); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarEmpresa(prosecution); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="idProsecution" id="id" readOnly onChange={this.handleChange} value={form ? form.idProsecution : this.state.data.length + 1} />
              <br />

              <label htmlFor="nombre">Departamento</label>
              <select name="departament" className="form-control" onChange={this.handleChange} value={form ? form.departament : ''}>
                {this.state.departaments.map(departament => (
                  <option key={departament.idDepartament} value={departament.idDepartament}>{departament.name}</option>
                )
                )
                }
              </select>
              <br />
              <label htmlFor="nombre">Municipio</label>
              <select name="municipality" className="form-control" onChange={this.handleChange} value={form ? form.municipality : ''}>
                {this.state.municipalities.map(municipality => (
                  <option key={municipality.idMunicipality} value={municipality.idMunicipality}>{municipality.name}</option>
                )
                )
                }
              </select>
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="name" id="nombre" onChange={this.handleChange} value={form ? form.name : ''} />
              <br />
              <label htmlFor="capital_bursatil">Direccion</label>
              <input className="form-control" type="text" name="direction" id="capital_bursatil" onChange={this.handleChange} value={form ? form.direction : ''} />
              <br />
              <label htmlFor="capital_bursatil">Telefono</label>
              <input className="form-control" type="text" name="tel" id="capital_bursatil" onChange={this.handleChange} value={form ? form.tel : ''} />
              <br />
              <CreatableSelect isMulti onChange={this.handleChangeSelect} options={options} value={form ? form.telephones : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar a la empresa {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}
export default App;
