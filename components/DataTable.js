// components/DataTable.js
import { Paper, TableCell, TableContainer, TableHead, TableRow, Table, TableBody, TablePagination, Button, TextField, Switch, FormControlLabel } from '@mui/material';
import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function DataTable() {
  const columns = [
    { id: 'id', name: "ID", minWidth: 100 },
    { id: 'name', name: 'Name', minWidth: 150 },
    { id: 'email', name: 'Email', minWidth: 200 },
    { id: 'action', name: 'Action', minWidth: 150 },
  ];

  const initialData = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    
  ];

  const [rowchange, setRowchange] = useState(initialData);
  const [pagechange, setPagechange] = useState(0);
  const [rowperpage, setRowperpage] = useState(10);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ id: '', name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const filteredRows = useMemo(() => {
    return rowchange.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rowchange, searchTerm]);

  const handlechangepage = (event, newpage) => {
    setPagechange(newpage);
  }

  const handleRowsperpage = (event) => {
    setRowperpage(+event.target.value);
    setPagechange(0);
  }

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditValues(row);
  }

  const handleDelete = (id) => {
    setRowchange(rowchange.filter(row => row.id !== id));
  }

  const handleSave = () => {
    setRowchange(rowchange.map(row => row.id === editingRow ? editValues : row));
    setEditingRow(null);
    setEditValues({ id: '', name: '', email: '' });
  }

  const handleCancel = () => {
    setEditingRow(null);
    setEditValues({ id: '', name: '', email: '' });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  }

  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#424242' : '#fff'
        },
        text: {
          primary: darkMode ? '#ffffff' : '#000000'
        }
      },
    }), [darkMode]
  );

  return (
    <ThemeProvider theme={theme} >
      <div className="App" style={{ backgroundColor: theme.palette.background.default, minHeight:"100vh", color: theme.palette.text.primary }}>
       <div className="heading" style={{margin:"auto" , fontSize:"2rem" , alignItems:"center" ,textAlign:"center" ,padding:"2rem"}}> <h1>Table</h1></div>
       <div className="container" style={{margin:"auto" , alignItems:"center" ,textAlign:"center" ,padding:"2rem"}}>
       <FormControlLabel
          control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
          label="Dark Mode"
        />
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '20px', backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary ,alignItems:"center" }}
          
        />
       </div>
        <Paper className='paper' style={{  backgroundColor: theme.palette.background.paper }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ backgroundColor: "black", color: "white",  }}>
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  filteredRows && filteredRows.slice(pagechange * rowperpage, pagechange * rowperpage + rowperpage).map((row) => (
                    <TableRow key={row.id} style={{ border: "2px solid green" }}>
                      {columns.map((column) => {
                        let value = row[column.id];
                        return (
                          <TableCell key={column.id} style={{ padding: "8px", border: "2px solid green" }}>
                            {column.id === 'action' ? (
                              editingRow === row.id ? (
                                <>
                                  <Button onClick={handleSave} color="primary">Save</Button>
                                  <Button onClick={handleCancel} color="secondary">Cancel</Button>
                                </>
                              ) : (
                                <>
                                  <Button onClick={() => handleEdit(row)} color="primary">Edit</Button>
                                  <Button onClick={() => handleDelete(row.id)} color="secondary">Delete</Button>
                                </>
                              )
                            ) : (
                              editingRow === row.id && column.id !== 'action' ? (
                                <TextField
                                  name={column.id}
                                  value={editValues[column.id]}
                                  onChange={handleInputChange}
                                />
                              ) : (
                                value
                              )
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            page={pagechange}
            count={filteredRows.length}
            rowsPerPage={rowperpage}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsperpage}
          />
        </Paper>
      </div>
    </ThemeProvider>
  );
}

export default DataTable;
