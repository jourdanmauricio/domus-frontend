import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    border: '1 solid #e0e0e0',
    marginBottom: 10,
  },
  box: {
    flex: 1,
    padding: 10,
    margin: 5,
    fontSize: 12,
  },
  boxLarge: {
    flex: 2,
    backgroundColor: '#f0f0f0',
  },
  columnContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  columnBox: {
    height: 50,
    margin: 5,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  mb10: {
    marginBottom: 10,
  },
});
