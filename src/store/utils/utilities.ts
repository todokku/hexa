import RegularAccount from '../../bitcoin/services/accounts/RegularAccount';
import SecureAccount from '../../bitcoin/services/accounts/SecureAccount';
import S3Service from '../../bitcoin/services/sss/S3Service';
import TestAccount from '../../bitcoin/services/accounts/TestAccount';
import { take, fork } from 'redux-saga/effects';

export const serviceGenerator = async (
  securityAns: string,
  mnemonic?: string,
  metaShares?: any,
): Promise<{
  regularAcc: RegularAccount;
  testAcc: TestAccount;
  secureAcc: SecureAccount;
  s3Service: S3Service;
}> => {
  // Regular account
  // let primaryMnemonic = mnemonic ? mnemonic : undefined;
  let primaryMnemonic =
    'life pigeon own melody setup monkey naive strategy apple record critic sock remember cube scene favorite movie assist column trade smart gentle citizen fox';
  const regularAcc = new RegularAccount(primaryMnemonic);
  let res;
  res = regularAcc.getMnemonic();
  if (res.status !== 200) throw new Error('Regular account gen failed');
  primaryMnemonic = res.data.mnemonic;
  console.log({ primaryMnemonic });

  // Test account
  const testMnemonic =
    'year mix quick okay hover arm fold pole minute twice cancel depend mercy simple empty pony saddle eternal found coyote ill staff wave dry';
  const testAcc = new TestAccount(testMnemonic);
  res = testAcc.getMnemonic();

  // Share generation
  const s3Service = new S3Service(primaryMnemonic);
  res = s3Service.generateShares(securityAns); // TODO: Generates new shares, swap with a mech that re-stores the shares used for wallet restoration
  if (res.status !== 200) throw new Error('Share generation failed');

  let secondaryXpub = '';
  let bhXpub = '';
  if (metaShares) {
    res = s3Service.decryptStaticNonPMDD(metaShares[0].encryptedStaticNonPMDD);
    if (res.status !== 200) throw new Error('Failed to decrypt StaticNPMDD');
    secondaryXpub = res.data.decryptedStaticNonPMDD.secondaryXpub;
    bhXpub = res.data.decryptedStaticNonPMDD.bhXpub;
  }

  secondaryXpub =
    'tpubDCPhm7bSboTYu9aEYWGDG1oqYqd6924VzHK75zZATQ9SSEBL8T8FhyRdK5CGwZQph4PqMRzwYRQnArbWKaSJrWY4kVinRTRiRySRv6beygu';
  bhXpub =
    'tpubDJZgDASwKGdxXH8LKjYLNbnoS8YfxPCMVRHU1hFzB7KMeSCPK7MbDs5sqtDXuuAuBrE8WwMJrGMDr8MStUAQ3fyaxxUEhSn8rgnJzyRzFrP';
  // Secure account
  const secureAcc = new SecureAccount(primaryMnemonic);
  if (!secondaryXpub) res = await secureAcc.setupSecureAccount();
  else res = await secureAcc.importSecureAccount(secondaryXpub, bhXpub); // restoring
  if (res.status !== 200) throw new Error('Secure account setup/import failed');

  return {
    regularAcc,
    testAcc,
    secureAcc,
    s3Service,
  };
};

export const createWatcher = (worker, type) => {
  return function*() {
    while (true) {
      const action = yield take(type);
      yield fork(worker, action);
    }
  };
};
