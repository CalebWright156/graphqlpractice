import { useState } from "react" 
import { FaList } from "react-icons/fa"
import { useMutation, useQuery } from "@apollo/client"
import { GET_PROJECTS } from "../queries/projectQueries"
import { GET_CLIENTS } from "../queries/clientQueries"
import { ADD_PROJECT } from "../mutations/projectMutations"


const AddProjectModal = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [clientId, setClientId] = useState('')
    const [status, setStatus] = useState('new')

    const [addProject] = useMutation(ADD_PROJECT, {
        variables: { name, description, clientId, status},
        update(cache, { data: { addProject } }) {
            const { projects } = cache.readQuery({ query: GET_PROJECTS })
            cache.writeQuery({
                query: GET_PROJECTS,
                data: { projects: [...projects, addProject] }
            })
        } 
    })

    const { loading, error, data } = useQuery(GET_CLIENTS)

    const onSubmit = (e) => {
        e.preventDefault();
        if (name === '' || description === '' || status === ''){
            return alert('Please fill in all fields')
        }

        addProject(name, description, clientId, status)

        setName('')
        setDescription('')
        setStatus('new')
        setClientId('')
    }

    if (loading) return null
    if (error) return "Something Went Wrong"


  return (
    <>
    { !loading && !error && (
        <>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
        <div className="d-flex align-items-center">
            <FaList className="icon" />
            <div>New Project</div>
        </div>
        </button>

        <div className="modal fade" id="addProjectModal" role="dialog" aria-labelledby="addProjectModal" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="addProjectModal">New Project</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <form onSubmit={onSubmit}>
                    <div className="md-4">
                        <label className="form-label">Name</label>
                        <input type='text' className='form-control' id='name' input={name} onChange={(e) => setName(e.target.value)}/>
                    </div> 
                    <div className="md-4">
                        <label className="form-label">Description</label>
                        <textarea className='form-control' id='description' input={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div> 
                    <div className="md-4">
                        <label className="form-label">Status</label>
                        <select className='form-select' id='status' value={status} onChange={ (e) => setStatus(e.target.value)}>
                            <option value='new'>Not Started</option>
                            <option value='progress'>In Progress</option>
                            <option value='completed'>Completed</option>
                        </select>
                    </div> 

                    <div className="mb-3">
                        <label className="form-label">Client</label>
                        <select className="form-select" id='client' value={clientId} onChange={ (e) => setClientId(e.target.value) }>
                            <option value=''>Select Client</option>
                            { data.clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-3">
                        <button className="btn btn-primary" type="submit" data-bs-dimsiss='modal'>Submit</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </div>
        </>
    )}

    </>
  )
}

export default AddProjectModal