import { createSlice, createAsyncThunk, AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { Data, RowData, AddRowData,ResType } from "./store.types";


const initialState: Data = {
    rows: [],
    loading: null,
    error: null,
    editable: null,
    path: []
};

export const fetchOverloads = createAsyncThunk<RowData[], undefined, {rejectValue: string}>(
    'outlays/fetchOverloads', 
    async function(_, {rejectWithValue}) {
        const response = await fetch(`${process.env.REACT_APP_EID}/list`);
        if (!response.ok) {
            return rejectWithValue('Server error');
        }
        const data = await response.json();

        return data;
          
});

export const addRow = createAsyncThunk<ResType, AddRowData, {rejectValue: string}>(
    'outlays/addRow',
    async function (rowData, { rejectWithValue }) {
        
        const { rowName,
            parentId,
            salary,
            equipmentCosts,
            overheads,
            estimatedProfit,
        } = rowData;
        
        const row: RowData = {
            rowName,
            parentId,
            salary,
            equipmentCosts,
            overheads,
            estimatedProfit,
            machineOperatorSalary: 0,
            mainCosts: 0,
            materials: 0,
            mimExploitation: 0,
            supportCosts: 0
        };
        
        const response = await fetch(`${process.env.REACT_APP_EID}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row)
        });

        if (!response.ok) {
            return rejectWithValue('Adding is not available');
        }

        return (await response.json()) as ResType;
    }
);

export const saveEditRow = createAsyncThunk<ResType, AddRowData, {rejectValue: string}>(
    'outlays/saveEditRow',
    async function (rowData, { rejectWithValue }) {
        
        const { rowName,
            id,
            salary,
            equipmentCosts,
            overheads,
            estimatedProfit,
        } = rowData;

        const row: RowData = {
            rowName,
            salary,
            equipmentCosts,
            overheads,
            estimatedProfit,
            machineOperatorSalary: 0,
            mainCosts: 0,
            materials: 0,
            mimExploitation: 0,
            supportCosts: 0
        };
        
        const response = await fetch(`${process.env.REACT_APP_EID}/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(row)
        });

        if (!response.ok) {
            return rejectWithValue('Edits are not available');
        }

        return (await response.json()) as ResType;
    }
);

export const deleteRow = createAsyncThunk<number, number, {rejectValue: string}>(
    'outlays/deleteRow',
    async function (id, { rejectWithValue }) {

            const response = await fetch(`${process.env.REACT_APP_EID}/${id}/delete`, {
                method: 'DELETE',
            });
        
            if (!response.ok) {
                return rejectWithValue('Delition is not available');
            }

            return id;
    }
             
);

const rowsSlice = createSlice({
    name: 'outlays',
    initialState,
    reducers: {

        addRowLocally(state, action: PayloadAction<number>) {
            const newRow: RowData = {
                equipmentCosts: 0,
                id: 0,
                estimatedProfit: 0,
                machineOperatorSalary: 0,
                mainCosts: 0,
                materials: 0,
                mimExploitation: 0,
                overheads: 0,
                parentId: action.payload,
                rowName: '',
                salary: 0,
                supportCosts: 0
            };

            if (state.rows.length > 0) {
                let parentRow: RowData = state.rows.find(row => row.id === state.path[0]) || {} as RowData;
            
                for (let id of state.path.slice(1)) {
                    if (parentRow.child) {
                        parentRow = parentRow.child.find(elem => elem.id === id) || {} as RowData
                    }
                }

                parentRow.child ? parentRow.child?.push(newRow) : parentRow.child = [newRow];
            } else {
                state.rows.push(newRow);
            }
        },
        
        setEditable(state, action: PayloadAction<number | null>) {
            state.editable = action.payload;
        },

        setPath(state, action: PayloadAction<Array<number>>) {
            state.path = action.payload;
        }
    },
     extraReducers(builder) {
        builder
            
        .addCase(fetchOverloads.pending, (state) => {
            state.loading = 'loading';
            state.error = null;
        })
        .addCase(fetchOverloads.fulfilled, (state, action: PayloadAction<RowData[]>) => {
            state.rows = action.payload;
            state.loading = 'fulfilled';

            if (action.payload.length === 0) {
                const newRow: RowData = {
                    equipmentCosts: 0,
                    id: 0,
                    estimatedProfit: 0,
                    machineOperatorSalary: 0,
                    mainCosts: 0,
                    materials: 0,
                    mimExploitation: 0,
                    overheads: 0,
                    parentId: null,
                    rowName: '',
                    salary: 0,
                    supportCosts: 0
                };
                state.rows.push(newRow);
                state.editable = 0;
                state.path = [0];
                
            }
        })
            
        .addCase(addRow.pending, (state) => {
            state.error = null;
        })
        .addCase(addRow.fulfilled, (state, action: PayloadAction<ResType>) => {
            
            if (state.path[0] !== 0) {
                let parentRow: RowData = state.rows.find((row) => row.id === state.path[0]) || {} as RowData; 
                
                for (let id of state.path.slice(1)) {
                    if (parentRow.child) {
                        parentRow = parentRow.child.find((row) => row.id === id) || {} as RowData                    
                    }
                }

                parentRow.child = parentRow.child?.map((row) => row.id === 0 ? {...row, ...action.payload.current} : row);
                state.editable = null;
                state.path = [];

            } else {

                state.rows = state.rows.filter((row) => row.id !== 0);
                state.rows.push(action.payload.current);
                state.editable = null;
                state.path = [];
            }
        })
            
        .addCase(saveEditRow.pending, (state) => {
            state.error = null;
        })
        .addCase(saveEditRow.fulfilled, (state, action: PayloadAction<ResType>) => {
            
            if (state.path.length > 1) {
                let parentRow: RowData = state.rows.find((row) => row.id === state.path[0]) || {} as RowData; 

                for (let id of state.path.slice(1, -1)) {
                    if (parentRow.child) {
                        parentRow = parentRow.child.find((row) => row.id === id) || {} as RowData                    
                    }
                }

                parentRow.child = parentRow.child?.map((row) => row.id === state.editable ? {...row, ...action.payload.current} : row);
                state.editable = null;
                state.path = [];
            } else {
                state.rows = state.rows.map((row) => row.id === state.editable ? { ...row, ...action.payload.current } : row);
                state.editable = null;
                state.path = [];
            }
        })
            
        .addCase(deleteRow.pending, (state) => {
            state.error = null;
        })
        .addCase(deleteRow.fulfilled, (state, action: PayloadAction<number>) => {
            
            if (state.path.length > 1) {
                let parentRow: RowData = state.rows.find((row) => row.id === state.path[0]) || {} as RowData;
                
                for (let id of state.path.slice(1, -1)) {
                    if (parentRow.child) {
                        parentRow = parentRow.child.find((row) => row.id === id) || {} as RowData                    
                    }
                }

                parentRow.child = parentRow.child?.filter((row) => row.id !== action.payload);
                state.editable = null;
                state.path = [];

            } else {
                state.rows = state.rows.filter((row) => row.id !== state.path[0]);
            }
            if (state.rows.length === 0) {
                const newRow: RowData = {
                    equipmentCosts: 0,
                    id: 0,
                    estimatedProfit: 0,
                    machineOperatorSalary: 0,
                    mainCosts: 0,
                    materials: 0,
                    mimExploitation: 0,
                    overheads: 0,
                    parentId: null,
                    rowName: '',
                    salary: 0,
                    supportCosts: 0
                };
                state.rows.push(newRow);
                state.editable = 0;
                state.path = [0];
                
            }
        })
        
        .addMatcher(isError, (state, action) => {
            state.error = action.payload;
            state.loading = 'error';
            
        })
    }
});

function isError(action: AnyAction) {
    return action.type.endsWith('rejected')
}

export default rowsSlice.reducer;
export const { addRowLocally, setEditable, setPath} = rowsSlice.actions;
