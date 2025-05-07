
import { Vehicle } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {vehicle.images && vehicle.images.length > 0 ? (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {vehicle.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1 h-64">
                      <img
                        src={image}
                        alt={`Vehicle image ${index + 1}`}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2" />
              <CarouselNext className="absolute right-2" />
            </Carousel>
            <div className="mt-2 flex justify-center gap-2">
              {vehicle.images.length} Image{vehicle.images.length !== 1 ? 's' : ''}
            </div>
          </div>
        ) : (
          <div className="border rounded-md h-64 flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-500">
            {vehicle.year} • {vehicle.color}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Car Number" value={vehicle.carNumber} />
          <DetailItem label="Type" value={vehicle.type} />
          <DetailItem label="Fuel Type" value={vehicle.fuelType} />
          <DetailItem label="Status" value={vehicle.status} />
          <DetailItem label="Price per Day" value={`${vehicle.pricePerDay} OMR`} />
          <DetailItem label="Current KM" value={vehicle.currentKm?.toString() || "0"} />
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="font-medium">
        {typeof value === 'string' && value.charAt(0).toUpperCase() + value.slice(1)}
      </p>
    </div>
  );
};

export default VehicleDetails;
