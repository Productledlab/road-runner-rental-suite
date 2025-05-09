import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Branch } from '@/lib/types';
import axios from '@/lib/axiosInstance';

export const useBranchData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);

    const loadBranchData = async (companyId?: string) => {
        setIsLoading(true);
        try {
            const param = companyId ? `company/${companyId}/` : '';
            const response = await axios.get(`/branches/${param}`);
            setBranches(response.data);
            setFilteredBranches(response.data);
        } catch (error: any) {
            toast({
                title: 'Failed',
                description: error?.response?.data?.message || 'No Data found',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        branches,
        filteredBranches,
        loadBranchData,
        setFilteredBranches
    };
};


export const useSaveBranch = () => {
    const [isSaving, setIsSaving] = useState(false);

    const saveBranch = async (data: Branch) => {
        setIsSaving(true);
        try {
            const response = data.id
                ? await axios.put(`/branches/${data.id}`, data)
                : await axios.post('/branches/', data);

            return response.data;
        } catch (error: any) {
            toast({
                title: 'Failed',
                description: error?.response?.data?.error || 'Failed',
                variant: 'destructive',
            });
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    return { isSaving, saveBranch };
};