import {
  StyleSheet,
  Text,
  View,
  useTVEventHandler,
  Platform,
  Pressable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  GestureResponderEvent,
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
      <PressableButton title="Pressable" log={updatePressableLog} />
      <TouchableOpacityButton
        title="TouchableOpacity"
        log={updatePressableLog}
      />
      <TouchableHighlightButton
        title="TouchableHighlight"
        log={updatePressableLog}
      />
      {Platform.OS === 'android' ? (
        <TouchableNativeFeedbackButton
          title="TouchableNativeFeedback"
          log={updatePressableLog}
        />
      ) : null}

      <View style={styles.logContainer}>
        <Text style={styles.logText}>{remoteEventLog.join('\n')}</Text>
        <Text style={styles.logText}>{pressableEventLog.join('\n')}</Text>
      </View>
    </View>
  );
}

const PressableButton = (props: {
  title: string;
  log: (entry: string) => void;
}) => {
  return (
    <Pressable
      onFocus={() => props.log(`${props.title} focus`)}
      onBlur={() => props.log(`${props.title} blur`)}
      onPress={() => props.log(`${props.title} pressed`)}
      onLongPress={(
        event: GestureResponderEvent & { eventKeyAction?: number },
      ) =>
        props.log(
          `${props.title} long press ${
            event.eventKeyAction === 0 ? 'start' : 'end'
          }`,
        )
      }
      style={({ pressed, focused }) =>
        pressed || focused ? styles.pressableFocused : styles.pressable
      }
    >
      {({ focused }) => {
        return (
          <Text style={styles.pressableText}>
            {focused ? `${props.title} focused` : props.title}
          </Text>
        );
      }}
    </Pressable>
  );
};

const TouchableOpacityButton = (props: {
  title: string;
  log: (entry: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.pressable}
      onFocus={() => props.log(`${props.title} focus`)}
      onBlur={() => props.log(`${props.title} blur`)}
      onPress={() => props.log(`${props.title} pressed`)}
      onLongPress={(
        event: GestureResponderEvent & { eventKeyAction?: number },
      ) =>
        props.log(
          `${props.title} long press ${
            event.eventKeyAction === 0 ? 'start' : 'end'
          }`,
        )
      }
    >
      <Text style={styles.pressableText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const TouchableHighlightButton = (props: {
  title: string;
  log: (entry: string) => void;
}) => {
  return (
    <TouchableHighlight
      style={styles.pressable}
      onFocus={() => props.log(`${props.title} focus`)}
      onBlur={() => props.log(`${props.title} blur`)}
      onPress={() => props.log(`${props.title} pressed`)}
      onLongPress={(
        event: GestureResponderEvent & { eventKeyAction?: number },
      ) =>
        props.log(
          `${props.title} long press ${
            event.eventKeyAction === 0 ? 'start' : 'end'
          }`,
        )
      }
    >
      <Text style={styles.pressableText}>{props.title}</Text>
    </TouchableHighlight>
  );
};

const TouchableNativeFeedbackButton = (props: {
  title: string;
  log: (entry: string) => void;
}) => {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.SelectableBackground()}
      onFocus={() => props.log(`${props.title} focus`)}
      onBlur={() => props.log(`${props.title} blur`)}
      onPress={() => props.log(`${props.title} pressed`)}
      onLongPress={(
        event: GestureResponderEvent & { eventKeyAction?: number },
      ) =>
        props.log(
          `${props.title} long press ${
            event.eventKeyAction === 0 ? 'start' : 'end'
          }`,
        )
      }
    >
      <View style={styles.pressable}>
        <Text style={styles.pressableText}>{props.title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

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
