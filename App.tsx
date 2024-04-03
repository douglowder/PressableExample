import {
  StyleSheet,
  Text,
  View,
  useTVEventHandler,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [remoteEventLog, setRemoteEventLog] = useState<string[]>([]);
  const [pressableEventLog, setPressableEventLog] = useState<string[]>([]);

  const logWithAppendedEntry = (log: string[], entry: string) => {
    const limit = 6;
    const newEventLog = log.slice(0, limit - 1);
    newEventLog.unshift(entry);
    return newEventLog;
  };

  const updatePressableLog = (entry: string) => {
    setPressableEventLog((log) => logWithAppendedEntry(log, entry));
  };

  useTVEventHandler((event) => {
    const { eventType, eventKeyAction } = event;
    if (eventType !== 'focus' && eventType !== 'blur') {
      setRemoteEventLog((log) =>
        logWithAppendedEntry(
          log,
          `type=${eventType}, action=${
            eventKeyAction !== undefined ? eventKeyAction : ''
          }`,
        ),
      );
    }
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => updatePressableLog('Pressable 1 pressed')}
        onFocus={() => updatePressableLog('Pressable 1 focused')}
        onBlur={() => updatePressableLog('Pressable 1 blur')}
        style={({ pressed, focused }) =>
          pressed || focused ? styles.pressableFocused : styles.pressable
        }
      >
        {({ focused }) => {
          return (
            <Text style={styles.pressableText}>
              {focused ? 'Pressable 1 focused' : 'Pressable 1'}
            </Text>
          );
        }}
      </Pressable>
      <Pressable
        onPress={() => updatePressableLog('Pressable 2 pressed')}
        onLongPress={() => updatePressableLog('Pressable 2 long press')}
        style={({ pressed, focused }) =>
          pressed || focused ? styles.pressableFocused : styles.pressable
        }
      >
        {({ focused }) => {
          return (
            <Text style={styles.pressableText}>
              {focused ? 'Pressable 2 focused' : 'Pressable 2'}
            </Text>
          );
        }}
      </Pressable>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => updatePressableLog('Touchable 1 pressed')}
        onFocus={() => updatePressableLog('Touchable 1 focused')}
        onBlur={() => updatePressableLog('Touchable 1 blur')}
      >
        <Text style={styles.pressableText}>Touchable 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => updatePressableLog('Touchable 2 pressed')}
        onLongPress={() => updatePressableLog('Touchable 2 long press')}
      >
        <Text style={styles.pressableText}>Touchable 2</Text>
      </TouchableOpacity>

      <View style={styles.logContainer}>
        <Text style={styles.logText}>{remoteEventLog.join('\n')}</Text>
        <Text style={styles.logText}>{pressableEventLog.join('\n')}</Text>
      </View>
    </View>
  );
}

const scale = Platform.isTV && Platform.OS === 'ios' ? 2 : 1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logContainer: {
    flexDirection: 'row',
    padding: 5 * scale,
    margin: 5 * scale,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  logText: {
    height: 100 * scale,
    width: 150 * scale,
    fontSize: 10 * scale,
    margin: 5 * scale,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  pressable: {
    borderColor: 'blue',
    backgroundColor: 'blue',
    borderWidth: 1,
    borderRadius: 5 * scale,
    margin: 5 * scale,
  },
  pressableFocused: {
    borderColor: 'blue',
    backgroundColor: '#000088',
    borderWidth: 1,
    borderRadius: 5 * scale,
    margin: 5 * scale,
  },
  pressableText: {
    color: 'white',
    fontSize: 15 * scale,
  },
});
