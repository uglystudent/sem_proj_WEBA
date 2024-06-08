import { GetServerSideProps } from 'next';
import Link from 'next/link';
import dbConnect from '../lib/dbConnect';
import Pet, { PetDocument } from '../models/Pet';

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

const Home = ({ pets }: Props) => {
  return (
    <div>
      <h1>List of Pets</h1>
      <div className="pet-list">
        {pets.map((pet) => (
          <div key={pet._id} className="card">
            <img src={pet.image_url} alt={`${pet.name}'s image`} />
            <h5 className="pet-name">{pet.name}</h5>
            <div className="main-content">
              <p className="pet-name">{pet.name}</p>
              <p className="owner">Owner: {pet.owner_name}</p>
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
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect();

  const result = await Pet.find({}).lean();
  const pets = result.map((doc) => ({
    _id: doc._id.toString(), // Convert ObjectId to string
    name: doc.name,
    owner_name: doc.owner_name,
    image_url: doc.image_url,
    likes: doc.likes,
    dislikes: doc.dislikes,
  }));

  return { props: { pets } };
};

export default Home;
