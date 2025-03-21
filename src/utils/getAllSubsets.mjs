// Given an array, generate all non-empty subsets using bitmasks.
export const getAllSubsets = (arr) => {
    const subsets = [];
    const n = arr.length;
    // from 1 to (2^n - 1) so we exclude the empty set.
    for (let mask = 1; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(arr[i]);
            }
        }
        subsets.push(subset);
    }

    return subsets;
};