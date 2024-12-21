export const createCustomMarker = (selected: boolean) => ({
  path: `
    M 16,0 
    C 7.16,0 0,7.16 0,16 
    C 0,28 16,40 16,40 
    C 16,40 32,28 32,16 
    C 32,7.16 24.84,0 16,0 
    Z
    M 16,8 
    C 20.42,8 24,11.58 24,16 
    C 24,20.42 20.42,24 16,24 
    C 11.58,24 8,20.42 8,16 
    C 8,11.58 11.58,8 16,8 
    Z
  `,
  fillColor: selected ? "hsl(196, 96%, 33%)" : "hsl(338, 94%, 49%)",
  fillOpacity: 0.9,
  strokeWeight: 2,
  strokeColor: selected ? "hsl(196, 66%, 51%)" : "hsl(331, 100%, 50%)",
  scale: 0.7,
  anchor: new google.maps.Point(16, 40),
  labelOrigin: new google.maps.Point(16, 16),
  strokeOpacity: 1,
  shadow: `
    0 0 5px ${selected ? "hsl(196, 96%, 33%)" : "hsl(338, 94%, 49%)"},
    0 0 10px ${selected ? "hsl(196, 66%, 51%)" : "hsl(331, 100%, 50%)"},
    0 0 15px ${selected ? "hsl(196, 66%, 51%, 0.5)" : "hsl(331, 100%, 50%, 0.5)"}
  `
}); 