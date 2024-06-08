import Link from "next/link";
import dbConnect from "../lib/dbConnect";
import Pet from "../models/Pet";
import { GetServerSideProps } from "next";
import mongoose from "mongoose";

type PetType = {
  _id: string;
  name: string;
  owner_name: string;
  image_url: string;
  likes: string[];
  dislikes: string[];
};

type Props = {
  pets: PetType[];
};

const Index = ({ pets }: Props) => {
  return (
    <>
      {pets.map((pet) => (
        <div key={pet._id}>
          <div className="card">
            <img src={pet.image_url} alt={`${pet.name}'s image`} />
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>

              {/* Extra Pet Info: Likes and Dislikes */}
              <div className="likes info">
                <p className="label">Likes</p>
                <ul>
                  {pet.likes.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              </div>
              <div className="dislikes info">
                <p className="label">Dislikes</p>
                <ul>
                  {pet.dislikes.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              </div>

              <div className="btn-container">
                <Link href={{ pathname: "/[id]/edit", query: { id: pet._id } }}>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href={{ pathname: "/[id]", query: { id: pet._id } }}>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

/* Retrieves pet(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect();

  /* find all the data in our database */
  const result = await Pet.find({}).lean();

  /* Ensures all objectIds are serialized as strings */
  const pets = result.map((doc) => ({
    _id: doc._id.toString(),
    name: doc.name,
    owner_name: doc.owner_name,
    image_url: doc.image_url,
    likes: doc.likes,
    dislikes: doc.dislikes,
  }));

  return { props: { pets } };
};

export default Index;
