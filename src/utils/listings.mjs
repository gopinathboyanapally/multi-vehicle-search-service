export const fitsInListing = (listing, vehicles) => {
    if (vehicles.length === 0) return true;
    const maxVehicleLength = Math.max(...vehicles.map(v => v.length));
    const totalWidth = vehicles.length * 10;

    return (maxVehicleLength <= listing.length) && (totalWidth <= listing.width);
};
