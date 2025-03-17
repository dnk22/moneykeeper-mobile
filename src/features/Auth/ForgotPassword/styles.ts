import { StyleSheet } from 'react-native';

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    borderRadius: 12,
    marginTop: -10,
    padding: 24,
    gap: 16,
  },
  formInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  submit: {
    marginTop: 8,
    paddingVertical: 16,
  },
  methodContainer: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  methodOptionActive: {
    borderColor: 'transparent',
  },
  methodTextContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  methodTitle: {
    marginBottom: 2,
    textAlign: 'center',
  },
  methodDescription: {
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default styles;
