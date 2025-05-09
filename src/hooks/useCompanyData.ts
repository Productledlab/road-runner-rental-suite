import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import axios from '@/lib/axiosInstance';
import { Company } from '@/lib/types';

export const useCompanies = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

    const loadCompanyData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/companies/');
            setCompanies(response.data);
            setFilteredCompanies(response.data);
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

    const saveCompany = async (data: Company) => {
        setIsLoading(true);
        try {
            const response = data.id
                ? await axios.put(`/companies/${data.id}`, data)
                : await axios.post('/companies/', data);

            return response.data;
        } catch (error: any) {
            toast({
                title: 'Failed',
                description: error?.response?.data?.error || 'Failed',
                variant: 'destructive',
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        companies,
        filteredCompanies,
        setFilteredCompanies,
        loadCompanyData,
        saveCompany,
    };
};