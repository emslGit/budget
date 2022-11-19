import React, { useMemo, useState, createContext, useEffect } from 'react';
import FinanceForm from '../financeForm/FinanceForm';
import ParamsForm from '../paramsForm/ParamsForm';
import Report from '../report/Report';
import { IFinanceItem, IFinanceParams } from '../../utils/interfaces';
import './baseLayout.css';
import FinanceTable from '../financeTable/FinanceTable';
import { Stack } from '@mui/system';
import dayjs, { Dayjs } from 'dayjs';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getFirestore, getDocs, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import { Box, Button, Modal, TextField } from '@mui/material';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8l83dB-be3NaJAkr0admdYDIEm4cfRq0",
  authDomain: "budget-9935a.firebaseapp.com",
  projectId: "budget-9935a",
  appId: "1:342126671611:web:dc7b724a8f5496e05a625e",
  measurementId: "G-LH6TPS721T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

interface ICtx {
  items: IFinanceItem[];
  params: IFinanceParams;
}

const initialParams = {
  roi: 12,
  salaryIncrease: 0,
  inflation: 2,
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const Context = createContext<ICtx>({
  items: [],
  params: {}
});

const BaseLayout: React.FC = () => {
  const [items, setItems] = useState<IFinanceItem[]>([]);
  const [params, setParams] = useState<IFinanceParams>(initialParams);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [signUpOpen, setSignUpOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user => {
      if (user) {
        setCurrentUser(user.email);
        getDocs(collection(db, 'financeItems')).then((res: QuerySnapshot) => {
          const _items: IFinanceItem[] = [];

          res.forEach((doc: DocumentSnapshot) => {
            const data = doc.data();
            if (data === undefined) {
              return;
            }

            _items.push({
              itemName: data.itemName,
              amount: Number(data.amount),
              category: Number(data.category),
              frequency: data.frequency,
              dateFrom: data.dateFrom ? dayjs.unix(data.dateFrom.seconds) : null,
              dateTo: data.dateTo ? dayjs.unix(data.dateTo.seconds) : null,
              key: data.key,
            });
          })

          setItems(_items);
        });

        setLoginOpen(false);
        setSignUpOpen(false);
      } else {
        setCurrentUser(null);
        setItems([]);
      }
    }));
  }
  , []);

  const addItem = (financeItem: IFinanceItem) => {
    setItems([financeItem, ...items]);
    if (currentUser) {

      console.log(financeItem?.dateTo?.unix());

      addDoc(collection(db, "financeItems"), {
        ...financeItem,
        dateFrom: financeItem.dateFrom ? financeItem.dateFrom.toDate() : null,
        dateTo: financeItem.dateTo ? financeItem.dateTo.toDate() : null,
      });
    }
  }

  const deleteItem = (key: string) => {
    setItems(items.filter(item => item.key != key));
  }

  const editItem = (financeItem: IFinanceItem) => {
    const filtered = items.filter(item => item.key != financeItem.key)
    setItems([financeItem, ...filtered]);
  }

  const updateParams = (params: IFinanceParams) => {
    setParams(params);
  }

  const handleLoginOpen = () => {
    setLoginOpen(true)
  };

  const handleLoginClose = () => {
    setLoginOpen(false)
  };

  const handleLogIn = () => {
    const email = (document.getElementById("login-email-input") as HTMLInputElement).value;
    const password = (document.getElementById("login-pw-input") as HTMLInputElement).value;
    signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  const handleSignUpOpen = () => setSignUpOpen(true);

  const handleSignUpClose = () => setSignUpOpen(false);

  const handleSignUp = () => {
    const email = (document.getElementById("sign-up-email-input") as HTMLInputElement).value;
    const password = (document.getElementById("sign-up-pw-input") as HTMLInputElement).value;
    createUserWithEmailAndPassword(auth, email, password);
  };

  const handleKeyDown = (event: React.KeyboardEvent, cb: Function) => {
    if (event.key === 'Enter') {
      cb();
    }
  }

  return (
    <Context.Provider value={{items: items, params: params}}>
      <main className="baseLayout center">
        <Stack className="login" direction="row" alignItems="center" spacing={1}>
          {currentUser === null && <>
            <Button variant="text" onClick={handleLoginOpen}>Log in</Button>
            <Button variant="outlined" onClick={handleSignUpOpen}>Sign Up</Button>
          </>}
          {currentUser !== null && <>
            <label>Logged in as <i>{currentUser}</i></label>
            <Button onClick={handleLogOut}>Log out</Button>
          </>}
          <Modal
            open={loginOpen}
            onClose={handleLoginClose}
            aria-labelledby="login-modal"
            aria-describedby="login-modal"
          >
            <Stack sx={style} spacing={2}>
              <h3>Log In</h3>
              <TextField
                fullWidth
                size="small"
                id="login-email-input"
                label="Email"
                type="email"
                variant="outlined"
                onKeyDown={(e) => handleKeyDown(e, handleLogIn)}
              />
              <TextField
                fullWidth
                size="small"
                id="login-pw-input"
                label="Password"
                type="password"
                variant="outlined"
                onKeyDown={(e) => handleKeyDown(e, handleLogIn)}
              />
              <Button onClick={() => handleLogIn()}>Log in</Button>
            </Stack>
          </Modal>
          <Modal
            open={signUpOpen}
            onClose={handleSignUpClose}
            aria-labelledby="sign-up-modal"
            aria-describedby="sign-up-modal"
          >
            <Stack sx={style} spacing={2}>
              <h3>Sign up</h3>
              <TextField
                fullWidth
                size="small"
                id="sign-up-email-input"
                label="Enter email"
                variant="outlined"
                onKeyDown={(e) => handleKeyDown(e, handleSignUp)}
              />
              <TextField
                fullWidth
                size="small"
                id="sign-up-pw-input"
                label="Create password"
                type="password"
                variant="outlined"
                onKeyDown={(e) => handleKeyDown(e, handleSignUp)}
              />
              <Button onClick={() => handleSignUp()}>Sign up</Button>
            </Stack>
          </Modal>
        </Stack>
        <Stack direction="column" sx={{width: 1500}} spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack sx={{width: 1}}>
              <Report items={items} params={params} />
            </Stack>
            <Stack sx={{width: 456}} spacing={2}>
              <ParamsForm handleUpdateClick={updateParams} />
              <FinanceForm handleAddFunction={addItem}/>
            </Stack>
          </Stack>
          <Stack sx={{width: 1}}>
            <FinanceTable handleDeleteFunction={deleteItem} handleEditFunction={editItem}/>
          </Stack>
        </Stack>
      </main>
    </Context.Provider>
  );
}

export default BaseLayout;
