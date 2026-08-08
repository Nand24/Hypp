import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../configs/axios";
import { dummyListings } from "../../assets/assets";

// Get all public listings
export const getAllPublicListing = createAsyncThunk("listing/getAllPublicListing", async () => {
    try {
        const { data } = await api.get("/api/listing/public");
        return data;
    } catch (error) {
        console.log(error);
        return { listings: dummyListings };
    }
});

// Get all user listings
export const getAllUserListing = createAsyncThunk("listing/getAllUserListing", async ({ getToken }) => {
    try {
        const token = await getToken();
        const { data } = await api.get("/api/listing/user", { headers: { Authorization: `Bearer ${token}` } });
        return data;
    } catch (error) {
        console.log(error);
        return { listings: [], balance: { earned: 0, withdrawn: 0, available: 0 } };
    }
});

const listingSlice = createSlice({
    name: "listing",
    initialState: {
        listings: dummyListings,
        userListings: [],
        balance: {
            earned: 0,
            withdrawn: 0,
            available: 0,
        },
    },
    reducers: {
        setListings: (state, action) => {
            state.listings = (action.payload && action.payload.length > 0) ? action.payload : dummyListings;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllPublicListing.fulfilled, (state, action) => {
            if (action.payload?.listings && action.payload.listings.length > 0) {
                state.listings = action.payload.listings;
            } else {
                state.listings = dummyListings;
            }
        });
        builder.addCase(getAllUserListing.fulfilled, (state, action) => {
            state.userListings = action.payload?.listings || [];
            state.balance = action.payload?.balance || {
                earned: 0,
                withdrawn: 0,
                available: 0,
            };
        });
    },
});

export const { setListings } = listingSlice.actions;

export default listingSlice.reducer;
