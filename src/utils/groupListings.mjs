import fs from 'fs';

const listings = JSON.parse(fs.readFileSync('listings.json', 'utf8'));

const groupByListings = listings.reduce((accumulator, listing) => {
    if (!accumulator[listing.location_id]) {
      accumulator[listing.location_id] = [];
    }
    accumulator[listing.location_id].push(listing);

    return accumulator;
}, {});

export default groupByListings;