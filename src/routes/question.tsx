import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Flag {
  png: string;
  svg: string;
  alt: string;
}

interface Name {
  common: string;
  official: string;
  nativeName: Record<string, { official: string; common: string }>;
}

interface Capital {
  [key: number]: string;
}

interface Country {
  flags: Flag;
  name: Name;
  capital: Capital;
}

function Question() {
  const fetchData = async () => {
    try {
      const { data } = await axios.get<Country[]>(
        "https://restcountries.com/v3.1/all?fields=flags,capital,name",
      );

      if (data) {
        return data.map((country) => ({
          NAMA: country.name.common,
          BENDERA: country.flags.svg,
          IBUKOTA: country.capital[0],
        }));
      }
    } catch (err) {
      console.error("error fetching data: ", err);
    }
  };

  const { data, status } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchData,
    staleTime: Infinity,
  });

  if (data) {
    console.log(data);
  }
  console.log(status);
  return (
    <>
      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error fetching data</div>
      ) : data ? (
        data.map((item, index) => (
          <div key={index}>
            <div>{item.NAMA}</div>
            <img src={item.BENDERA} alt="Flag" />
            <div>{item.IBUKOTA}</div>
          </div>
        ))
      ) : null}
    </>
  );
}

export default Question;
