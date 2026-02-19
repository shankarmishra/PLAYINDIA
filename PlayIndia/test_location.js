// Test script to verify if the new API key works
const testLocation = async () => {
  const testLat = 28.554348;
  const testLng = 77.339658;
  const testKey = 'AIzaSyAMa21EOJBWoI76FClNbfSeI9044p6RnQo';
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${testLat},${testLng}&key=${testKey}`;
  
  console.log('Testing URL:', url);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Response Status:', data.status);
    if (data.status === 'OK' && data.results && data.results[0]) {
      console.log('✓ Success! Address:', data.results[0].formatted_address);
      return true;
    } else {
      console.log('✗ Error:', data.status, data.error_message || 'No results');
      return false;
    }
  } catch (error) {
    console.log('✗ Request failed:', error.message);
    return false;
  }
};

// Run the test
testLocation().then(result => {
  console.log('Test result:', result ? 'PASSED' : 'FAILED');
});