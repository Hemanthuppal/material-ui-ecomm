// Fetch data from API and store it directly in the users variable
export const users = fetch('http://localhost:3001/customers')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  })
  .then(data => {
    console.log("Data - users ", data);
    return data;
  })
  .catch(error => {
    console.error('Error fetching customers:', error);
    return [];
  });
