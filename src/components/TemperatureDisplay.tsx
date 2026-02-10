import { TemperatureUnit } from "../types/weather";
import { formatTemperature, getTempUnitSymbol } from "../utils/weatherUtils";

interface TemperatureDisplayProps {
    value: number;
    unit: TemperatureUnit;
    rounded?: boolean;
}

const TemperatureDisplay = ({ value, unit, rounded = true}: TemperatureDisplayProps) => {

    return (
        <div>
            <p className="font-medium text-4xl">
                {formatTemperature(value, 'celsius', unit, rounded)}
                {getTempUnitSymbol(unit)}
            </p>
        </div>
    )
}

export default TemperatureDisplay


{/*use tofixed for more precise temerature with decimals and math.round for whole numbers(typically used in Consumer Apps)*/}
{/*{displayTemp.toFixed(1)}*/}
    