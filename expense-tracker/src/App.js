import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const App = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(dayjs());
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenses(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!description || !amount || !date) return;
    const newExpense = { description, amount: parseFloat(amount), date: date.toISOString() };
    setExpenses([...expenses, newExpense]);
    setDescription('');
    setAmount('');
    setDate(dayjs());
  };

  const totalExpenses = expenses
    .filter(expense => dayjs(expense.date).month() === dayjs().month() && dayjs(expense.date).year() === dayjs().year())
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Add New Expense</Typography>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
              />
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={addExpense} fullWidth style={{ marginTop: 16 }}>
              Add Expense
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6">Expenses for {dayjs().format('MMMM YYYY')}</Typography>
            <List>
              {expenses.map((expense, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${expense.description} - $${expense.amount.toFixed(2)}`}
                    secondary={dayjs(expense.date).format('MMMM D, YYYY')}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" style={{ marginTop: 16 }}>
              Total: ${totalExpenses.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
