import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useState } from "react";

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

interface PilihanJawaban {
  [key: number]: string;
}

interface Country {
  flags: Flag;
  name: Name;
  capital: Capital;
}

function Question() {
  const [cekJawaban, setCekJawaban] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleClick = (answer: string) => {
    setSelectedAnswer(answer);
  };
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

  const { data, status, refetch } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchData,
  });

  let correctNum = 0;
  let randomNum1 = 0;
  let randomNum2 = 0;
  let randomNum3 = 0;

  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  if (data) {
    // Fungsi untuk menghasilkan angka acak yang unik
    const getUniqueRandomNum = (min: number, max: number): number => {
      const numbers = [];
      for (let i = min; i <= max; i++) {
        numbers.push(i);
      }
      // Acak array
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      // Kembalikan angka pertama dari array yang sudah diacak
      return numbers[0];
    };

    // Jawaban benar
    correctNum = getUniqueRandomNum(0, data.length - 1);

    // Pilihan jawaban lainnya
    randomNum1 = getUniqueRandomNum(0, data.length - 1);
    randomNum2 = getUniqueRandomNum(0, data.length - 1);
    randomNum3 = getUniqueRandomNum(0, data.length - 1);
  }

  let pilihanJawaban = [];

  pilihanJawaban = data
    ? [
        data[randomNum1].NAMA,
        data[randomNum2].NAMA,
        data[randomNum3].NAMA,
        data[correctNum].NAMA,
      ]
    : [];
  pilihanJawaban = shuffle(pilihanJawaban);

  if (status === "pending") {
    return <div>loading...</div>;
  }
  if (status === "error") {
    return <div>Error fetching data</div>;
  }
  return status === "success" && data ? (
    <>
      <div>
        <img src={data[correctNum].BENDERA} />

        <p>{data[correctNum].IBUKOTA} is the capital of</p>
        <br />
        {pilihanJawaban.map((item, index) => (
          <div key={index}>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleClick(item);
              }}
              colorScheme={
                selectedAnswer === item && item === data[correctNum].NAMA
                  ? "green"
                  : selectedAnswer === item
                    ? "red"
                    : "initial"
              }
              variant="outline"
            >
              {item}
            </Button>
          </div>
        ))}
      </div>
    </>
  ) : null;
}

export default Question;
