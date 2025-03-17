import { StyleSheet } from 'react-native';

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  topBlock: {
    flex: 1,
    padding: 24,
  },
  bottomBlock: {
    flex: 3.5,
    borderRadius: 12,
    marginTop: -10,
    padding: 24,
    gap: 16,
  },
  logo: {
    width: 18,
    height: 18,
  },
  logoContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  appName: {
    fontWeight: '300',
  },
  actionContainer: {
    marginTop: 32,
    gap: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  signup: {
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  formContainer: {
    position: 'absolute',
    height: '50%',
    width: 327,
    padding: 24,
    borderRadius: 10,
    alignSelf: 'center',
  },
  formInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  submit: {
    marginTop: 16,
  },
  otherMethods: {
    marginTop: 24,
    alignItems: 'center',
    gap: 32,
  },
  divider: {
    height: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  otherMethodsText: {
    top: -10,
    position: 'absolute',
    paddingHorizontal: 24,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});

export default styles;
